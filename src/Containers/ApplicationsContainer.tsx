import {
  Avatar,
  Button,
  Flex,
  HStack,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import userImageUri from '@/Services/utils/userImageUri'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { MeetingApplication } from '@/Services/modules/applications/fetchApplications'
import { MeetingApplicationsEnum } from '@/Services/enums/applications/MeetingApplicationsEnum'
import {
  applicationsApi,
  useFetchApplicationsQuery,
} from '@/Services/modules/applications'
import SpinnerModal from '@/Components/SpinnerModal'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { goBack, navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'

type ApplicationsContainerProps = {
  meetingId: string
}

const ApplicationsContainer = () => {
  const route =
    useRoute<RouteProp<Record<string, ApplicationsContainerProps>, string>>()

  const meetingId = route.params.meetingId
  const [applications, setApplications] = useState<Array<MeetingApplication>>(
    [],
  )

  const [spinnerModalVisible, setSpinnerModalVisible] = useState(false)

  const fetchApplications = useFetchApplicationsQuery({ id: meetingId })
  const [acceptApplication] =
    applicationsApi.useAcceptApplicationMutationMutation()
  const [rejectApplication] =
    applicationsApi.useRejectApplicationMutationMutation()

  const acceptApplicationHandler = async (mId: string, userId: string) => {
    setSpinnerModalVisible(true)
    await acceptApplication({
      meetingId: mId,
      userId: userId,
    })
    setSpinnerModalVisible(false)
  }

  const rejectApplicationHandler = async (mId: string, userId: string) => {
    setSpinnerModalVisible(true)
    await rejectApplication({ meetingId: mId, userId: userId })
    setSpinnerModalVisible(false)
  }

  const { data } = fetchApplications
  useEffect(() => {
    const order: string[] = [
      MeetingApplicationsEnum.PENDING,
      MeetingApplicationsEnum.ACCEPTED,
      MeetingApplicationsEnum.REJECTED,
    ]
    function compareByArray(a: MeetingApplication, b: MeetingApplication) {
      if (order.indexOf(a.status) < order.indexOf(b.status)) {
        return -1
      }
      if (order.indexOf(a.status) > order.indexOf(b.status)) {
        return 1
      }
      return 0
    }
    if (data) {
      let dataCopy = data.slice()
      let dataSorted = dataCopy.sort(compareByArray)
      setApplications(dataSorted)
    }
  }, [data])

  return (
    <Flex flex={1}>
      <SpinnerModal isOpen={spinnerModalVisible} />
      <ScreenTopHeader title={'Join requests'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <Flex flex={1} width={'100%'} px={5}>
        <FlatList
          data={applications}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigate<MainNavigationRoutes.USER_PROFILE>(
                  MainNavigationRoutes.USER_PROFILE,
                  { userId: item.userId },
                )
              }
            >
              <HStack width={'100%'} py={2} mr={'auto'} flex={1}>
                <Avatar
                  size={'md'}
                  bg={'muted.400'}
                  borderColor={'white'}
                  borderWidth={0.5}
                  source={{
                    uri: userImageUri(item.imageId),
                  }}
                >
                  <AppIcon iconName={'person'} size={30} color={'#FFFFFF'} />
                </Avatar>
                <VStack
                  textAlign={'left'}
                  alignItems={'flex-start'}
                  ml={5}
                  flex={3}
                >
                  <Text
                    fontSize={'lg'}
                    textAlign={'left'}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                  >
                    {item.name}
                  </Text>
                  <Text fontSize={'sm'} textAlign={'left'}>
                    {item.status}
                  </Text>
                </VStack>
                {item.status === MeetingApplicationsEnum.PENDING && (
                  <HStack
                    ml={1}
                    my={'auto'}
                    flex={2}
                    flexDirection={'row'}
                    height={'60%'}
                    space={1}
                  >
                    <Button
                      p={0}
                      borderRadius={'3xl'}
                      flex={1}
                      backgroundColor={'muted.300'}
                      onPress={() => {
                        rejectApplicationHandler(meetingId, item.userId).then()
                      }}
                    >
                      <AppIcon iconName={'close'} size={20} />
                    </Button>
                    <Button
                      p={0}
                      borderRadius={'3xl'}
                      flex={1}
                      backgroundColor={'primary.500'}
                      onPress={() => {
                        acceptApplicationHandler(meetingId, item.userId).then()
                      }}
                    >
                      <AppIcon iconName={'checkmark'} size={20} />
                    </Button>
                  </HStack>
                )}
              </HStack>
            </Pressable>
          )}
          ItemSeparatorComponent={() => {
            return (
              <Flex
                borderBottomColor={'coolGray.300'}
                borderBottomWidth={'1px'}
              />
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

export default ApplicationsContainer
