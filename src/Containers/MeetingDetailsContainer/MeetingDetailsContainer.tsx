import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { meetingsApi, useFetchMeetingQuery } from '@/Services/modules/meetings'
import { Meeting, Participant } from '@/Services/modules/meetings/fetchMeeting'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  Pressable,
  ScrollView,
  Stack,
  Text,
  useToast,
  VStack,
} from 'native-base'
import {
  ImageBackground,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { DateTime } from 'luxon'
import { MeetingRolesEnum } from '@/Services/enums/meetings/MeetingRolesEnum'
import UserPreview from '@/Components/UserPreview'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { AuthState } from '@/Store/Auth'
import { useSelector } from 'react-redux'
import { MeetingStatusesEnum } from '@/Services/enums/meetings/MeetingStatusesEnum'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import backgroundImageBigUri from '@/Services/utils/backgroundImageBigUri'
import userImageUri from '@/Services/utils/userImageUri'
import AvatarCustomized from '@/Components/AvatarCustomized'
import { useFetchApplicationsQuery } from '@/Services/modules/applications'
import { MeetingApplication } from '@/Services/modules/applications/fetchApplications'
import { MeetingApplicationsEnum } from '@/Services/enums/applications/MeetingApplicationsEnum'
import MeetingTagBadge from '@/Components/MeetingTagBadge'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { dateTimeFormatPattern } from '@/Services/consts/consts'
import AlertConfimationDialog from '@/Components/AlertConfirmationDialog'
import { Hyperlink } from 'react-native-hyperlink'
import Clipboard from '@react-native-clipboard/clipboard'
import {
  meetingNotificationsApi,
  MeetingNotificationsSingleAPIResponse,
} from '@/Services/modules/meeting-notifications'

type MeetingContainerParams = {
  meetingId: string
}

const MeetingDetailsContainer = () => {
  const route =
    useRoute<RouteProp<Record<string, MeetingContainerParams>, string>>()
  const user = useSelector((state: { auth: AuthState }) => state.auth.user)
  const meetingId = route.params.meetingId

  const toast = useToast()

  const [meetingData, setMeetingData] = useState<Meeting>()

  const [mapModalVisible, setMapModalVisible] = useState(false)
  const [spinnerVisible, setSpinnerVisible] = useState(false)

  const [currentRole, setCurrentRole] = useState<string>()

  const [applications, setApplications] = useState<Array<MeetingApplication>>(
    [],
  )

  const [leaveConfirmationAlertVisible, setLeaveConfirmationAlertVisible] =
    useState(false)

  const fetchMeeting = useFetchMeetingQuery({ id: meetingId })
  const fetchApplications = useFetchApplicationsQuery({ id: meetingId })

  const [mutationMeetingNotificationsMarkAsSeen] =
    meetingNotificationsApi.endpoints.meetingNotificationsMarkAsSeenMutation.useMutation()

  const meetingsNotificationState =
    meetingNotificationsApi.endpoints.fetchMeetingNotifications.useQueryState(
      {},
    )

  const [joinMeeting] = meetingsApi.useRequestToJoinMeetingMutationMutation()

  const joinMeetingHandler = async (id: string, isPublic: boolean) => {
    setSpinnerVisible(true)
    await joinMeeting({ id: id, isPublic })
    setSpinnerVisible(false)
  }

  const [leaveMeeting] = meetingsApi.useLeaveMeetingMutationMutation()
  const leaveMeetingHandler = async (id: string) => {
    setSpinnerVisible(true)
    await leaveMeeting({ id: id })
    setSpinnerVisible(false)
  }

  const renderOwnerInfo = (participants: Array<Participant>) => {
    const owner = participants.filter(
      p => p.meetingRole === MeetingRolesEnum.HOSTED,
    )[0]
    return (
      <HStack
        backgroundColor={'white:alpha.80'}
        mx={1}
        p={3}
        borderRadius={'lg'}
        justifyContent={'center'}
        space={2}
        bg={{
          linearGradient: {
            colors: ['rgba(24, 24, 27, 0.8)', 'rgba(24, 24, 27, 0.7)'],
            start: [0, 1],
            end: [0, 0],
          },
        }}
      >
        <AvatarCustomized imageUri={userImageUri(owner.imageId)} />
        <TouchableOpacity
          onPress={() =>
            navigate<MainNavigationRoutes.USER_PROFILE>(
              MainNavigationRoutes.USER_PROFILE,
              { userId: owner.userId },
            )
          }
        >
          <Text
            color={'muted.100'}
            textAlign={'center'}
            fontWeight={'bold'}
            fontSize={'md'}
            m={'auto'}
          >
            by {owner.name || 'Anonymous'}
          </Text>
        </TouchableOpacity>
      </HStack>
    )
  }

  const renderActionButton = (mData: Meeting, userRole?: string) => {
    switch (true) {
      case (
        [
          MeetingStatusesEnum.CANCELLED,
          MeetingStatusesEnum.FINISHED,
        ] as string[]
      ).includes(mData.status):
        return (
          <Box borderBottomColor={'coolGray.300'} borderBottomWidth={'1px'}>
            <Button
              my={2}
              backgroundColor={'danger.600'}
              disabled={true}
              flex={1}
            >
              {`Meeting is ${mData.status.toLowerCase()}`}
            </Button>
          </Box>
        )
      case userRole !== MeetingRolesEnum.HOSTED &&
        mData.participantsLimit === mData.participants.length:
        return (
          <Box borderBottomColor={'coolGray.300'} borderBottomWidth={'1px'}>
            <Button
              my={2}
              backgroundColor={'danger.600'}
              disabled={true}
              flex={1}
            >
              Meeting is full.
            </Button>
          </Box>
        )
      case userRole === undefined &&
        !applications.some(a => a.userId === user?.userDetails?.id):
        return (
          <Box borderBottomColor={'coolGray.300'} borderBottomWidth={'1px'}>
            <Button
              my={2}
              onPress={() => {
                joinMeetingHandler(meetingId, mData.isPublic).then()
              }}
              width={'100%'}
            >
              {mData.isPublic ? 'Join meeting' : 'Request to join'}
            </Button>
          </Box>
        )
      case userRole === undefined &&
        applications.some(a => a.userId === user?.userDetails?.id):
        return (
          <Box borderBottomColor={'coolGray.300'} borderBottomWidth={'1px'}>
            <Button
              my={2}
              onPress={() => {
                joinMeetingHandler(meetingId, mData.isPublic).then()
              }}
              width={'100%'}
              disabled={
                applications
                  .filter(a => a.userId === user?.userDetails?.id)[0]
                  .status.toLowerCase() === 'pending'
              }
              colorScheme={
                applications
                  .filter(a => a.userId === user?.userDetails?.id)[0]
                  .status.toLowerCase() === 'pending'
                  ? 'muted'
                  : 'primary'
              }
            >
              {`Your application is ${applications
                .filter(a => a.userId === user?.userDetails?.id)[0]
                .status.toLowerCase()}`}
            </Button>
          </Box>
        )
      case userRole !== MeetingRolesEnum.HOSTED:
        return (
          <Box borderBottomColor={'coolGray.300'} borderBottomWidth={'1px'}>
            <AlertConfimationDialog
              textHeader={'Leave meeting'}
              textQuestion={'Are you sure want to leave meeting?'}
              textConfirm={'Yes'}
              textCancel={'No'}
              isOpen={leaveConfirmationAlertVisible}
              onConfirm={() => {
                leaveMeetingHandler(meetingId).then()
                setLeaveConfirmationAlertVisible(false)
              }}
              onCancel={() => {
                setLeaveConfirmationAlertVisible(false)
              }}
            />
            <Button
              backgroundColor={'danger.600'}
              my={2}
              onPress={() => {
                setLeaveConfirmationAlertVisible(true)
              }}
              width={'100%'}
            >
              Leave meeting
            </Button>
          </Box>
        )
    }
  }

  const meetingResponse = fetchMeeting
  const applicationsResponse = fetchApplications

  useEffect(() => {
    if (meetingResponse.data) {
      setMeetingData(meetingResponse.data)
      let currentRolesList = meetingResponse.data.participants.filter(
        item => item.userId === user?.userDetails?.id,
      )
      setCurrentRole(
        currentRolesList[0] ? currentRolesList[0].meetingRole : undefined,
      )
      if (!meetingResponse.data.isPublic && applicationsResponse.data) {
        setApplications(applicationsResponse.data)
      }
    }
  }, [
    applicationsResponse,
    meetingId,
    meetingResponse.data,
    user?.userDetails?.id,
  ])

  useEffect(() => {
    const findConnectedNotification =
      (): MeetingNotificationsSingleAPIResponse[] => {
        if (meetingsNotificationState.data) {
          return meetingsNotificationState.data.filter(
            notification => notification.meetingId === meetingId,
          )
        }
        return []
      }

    const markNotificationsAsSeen = async (
      notifications: MeetingNotificationsSingleAPIResponse[],
    ) => {
      await mutationMeetingNotificationsMarkAsSeen({
        ids: notifications.map(notification => notification.id),
      })
    }

    const connectedNotifications = findConnectedNotification()
    if (connectedNotifications.length) {
      markNotificationsAsSeen(connectedNotifications)
    }
  }, [
    meetingId,
    meetingResponse.data,
    meetingsNotificationState.data,
    mutationMeetingNotificationsMarkAsSeen,
  ])

  return (
    <Flex flex={1}>
      <HStack
        w={'100%'}
        h={'60px'}
        overflow="hidden"
        borderColor="coolGray.300"
        borderWidth="1"
        bg={'white'}
        alignItems={'center'}
        px={5}
      >
        <Flex alignItems={'flex-start'} direction={'row'}>
          <Heading my={'auto'} flex={5}>
            Meeting details
          </Heading>
          {(currentRole === MeetingRolesEnum.HOSTED ||
            currentRole === MeetingRolesEnum.LEAD) &&
            meetingData !== undefined &&
            meetingData.status === MeetingStatusesEnum.UPCOMING &&
            !applicationsResponse.isLoading && (
              <HStack flex={2} alignSelf={'flex-end'}>
                {!meetingData.isPublic && (
                  <Pressable
                    alignSelf={'flex-end'}
                    my={'auto'}
                    flex={1}
                    onPress={() => {
                      navigate(MainNavigationRoutes.APPLICATIONS, {
                        meetingId: meetingId,
                      })
                    }}
                  >
                    <AppIcon
                      style={{ textAlign: 'right' }}
                      iconName={'person-outline'}
                      size={26}
                    />
                    <Flex
                      position={'absolute'}
                      right={-12}
                      backgroundColor={'danger.600'}
                      borderRadius={'3xl'}
                      width={5}
                      height={5}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Text
                        color={'white'}
                        fontSize={'2xs'}
                        fontWeight={'semibold'}
                      >
                        {
                          applications.filter(
                            a => a.status === MeetingApplicationsEnum.PENDING,
                          ).length
                        }
                      </Text>
                    </Flex>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    navigate(MainNavigationRoutes.EDIT_MEETING, {
                      meetingId: meetingData.id,
                    })
                  }}
                  alignSelf={'flex-end'}
                  textAlign={'end'}
                  my={'auto'}
                  ml={5}
                  flex={1}
                >
                  <AppIcon
                    style={{ textAlign: 'right' }}
                    iconName={'create-outline'}
                    size={26}
                  />
                </Pressable>
              </HStack>
            )}
        </Flex>
      </HStack>
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl
            refreshing={
              spinnerVisible ||
              meetingResponse.isLoading ||
              meetingResponse.isFetching ||
              applicationsResponse.isLoading
            }
            onRefresh={() => {
              fetchMeeting.refetch()
              fetchApplications.refetch()
            }}
          />
        }
      >
        {meetingData !== undefined ? (
          <Flex flex={1}>
            <Modal
              height={'50%'}
              p={3}
              m={'auto'}
              isOpen={mapModalVisible}
              onClose={() => {
                setMapModalVisible(false)
              }}
            >
              <Modal.Header width={'100%'} backgroundColor={'white'}>
                Meeting location <Modal.CloseButton />
              </Modal.Header>

              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: meetingData.latitude,
                  longitude: meetingData.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: meetingData.latitude,
                    longitude: meetingData.longitude,
                  }}
                />
              </MapView>
            </Modal>
            <Box>
              <ImageBackground
                source={{ uri: backgroundImageBigUri(meetingData.imageId) }}
                style={{ aspectRatio: 1, width: '100%' }}
              >
                <Stack space={3} height={'100%'} direction={'column-reverse'}>
                  <Stack
                    space={2}
                    px={4}
                    py={3}
                    bg={{
                      linearGradient: {
                        colors: ['dark.50', 'rgba(24, 24, 27, 0)'],
                        start: [0, 1],
                        end: [0, 0],
                      },
                    }}
                  >
                    <HStack flexWrap={'wrap'} ml={-2}>
                      <MeetingTagBadge
                        tagName={meetingData.isPublic ? 'public' : 'private'}
                        key={-1}
                        fontWeight={'bold'}
                      />
                      {meetingData.tags &&
                        meetingData.tags.map((tag, tagIndex) => (
                          <MeetingTagBadge
                            tagName={tag}
                            key={tagIndex}
                            fontWeight={'400'}
                          />
                        ))}
                    </HStack>
                    <Heading size="xl" ml="-1" color={'muted.100'}>
                      {meetingData.name}
                    </Heading>
                    <HStack space={2} alignItems={'center'}>
                      <AppIcon
                        iconName={'calendar'}
                        size={26}
                        color={'#f5f5f5'}
                      />
                      <Text color={'muted.100'}>
                        {DateTime.fromISO(meetingData.startDate).toFormat(
                          dateTimeFormatPattern,
                        )}{' '}
                        -{' '}
                        {DateTime.fromISO(meetingData.endDate).toFormat(
                          dateTimeFormatPattern,
                        )}
                      </Text>
                    </HStack>
                    <HStack space={2} alignItems={'center'}>
                      <AppIcon
                        iconName={'people'}
                        size={26}
                        color={'#f5f5f5'}
                      />
                      <Text color={'muted.100'}>
                        {meetingData.participants.length} /
                        {meetingData.participantsLimit || ' Unlimited'}
                      </Text>
                    </HStack>
                  </Stack>
                  <HStack position={'absolute'} top={2} left={1}>
                    {renderOwnerInfo(meetingData.participants)}
                  </HStack>
                </Stack>
              </ImageBackground>
            </Box>

            <Box px={3} pb={10}>
              <VStack pb={2}>
                {renderActionButton(meetingData, currentRole)}
                <Pressable
                  onPress={() => setMapModalVisible(!mapModalVisible)}
                  borderBottomColor={'coolGray.300'}
                  borderBottomWidth={'1px'}
                  pb={2}
                >
                  <HStack space={2} mt={2} alignItems={'center'}>
                    <AppIcon iconName={'location'} size={28} />
                    <VStack flex={1}>
                      <Text flexWrap={'wrap'} fontWeight="semibold">
                        {meetingData.locationName}
                      </Text>
                      <Text flexWrap={'wrap'}>
                        {meetingData.locationDescription}
                      </Text>
                    </VStack>
                    <Flex justifyContent={'center'} marginY={'auto'}>
                      <AppIcon iconName={'chevron-forward-outline'} size={28} />
                    </Flex>
                  </HStack>
                </Pressable>
              </VStack>
              <Pressable
                onPress={() => {
                  navigate(MainNavigationRoutes.PARTICIPANTS, {
                    participants: meetingData.participants,
                  })
                }}
                borderBottomColor={'coolGray.300'}
                borderBottomWidth={'1px'}
              >
                <HStack py={3}>
                  <UserPreview
                    title={'Participants'}
                    participants={meetingData.participants}
                  />
                  <Flex justifyContent={'center'} marginY={'auto'}>
                    <AppIcon iconName={'chevron-forward-outline'} size={28} />
                  </Flex>
                </HStack>
              </Pressable>

              <Flex
                px={2}
                pb={2}
                borderBottomColor={'coolGray.300'}
                borderBottomWidth={'1px'}
              >
                <Heading size="md" color={'black'} my={4}>
                  About
                </Heading>
                <Text fontSize="sm" fontWeight={'normal'} color={'black'}>
                  {meetingData.description}
                </Text>
              </Flex>

              <Flex
                px={2}
                pb={2}
                borderBottomColor={'coolGray.300'}
                borderBottomWidth={'1px'}
              >
                <Heading size="md" color={'black'} my={4}>
                  Additional info for participants
                </Heading>
                <Hyperlink
                  linkDefault={true}
                  linkStyle={{
                    color: '#0000EE',
                    textDecorationLine: 'underline',
                  }}
                  onLongPress={url => {
                    toast.show({ description: 'Link copied' })
                    Clipboard.setString(url)
                  }}
                  linkText={url => `${url.substring(0, 30)}...`}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={'normal'}
                    color={currentRole ? 'black' : 'muted.500'}
                  >
                    {currentRole
                      ? meetingData.confidentialInfo
                      : 'This information is visible to participants only'}
                  </Text>
                </Hyperlink>
              </Flex>
            </Box>
          </Flex>
        ) : (
          <Box />
        )}
      </ScrollView>
    </Flex>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    flexGrow: 1,
  },
})

export default MeetingDetailsContainer
