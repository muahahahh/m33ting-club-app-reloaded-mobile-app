import React, { useEffect, useState } from 'react'
import { AddIcon, Fab, FlatList, Flex } from 'native-base'
import { useFetchMeetingsOwnQuery } from '@/Services/modules/meetings'
import MeetingsPreview from '@/Components/MeetingPreview/MeetingPreview'
import { MeetingOwn } from '@/Services/modules/meetings/fetchMeetingsOwn'
import NothingToShowHere from '@/Components/NothingToShowHere'
import FilterCloudsList from '@/Components/FilterCloudList/FilterCloudsList'
import { MeetingStatusesEnum } from '@/Services/enums/meetings/MeetingStatusesEnum'
import { MeetingRolesEnum } from '@/Services/enums/meetings/MeetingRolesEnum'
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { navigate } from '@/Navigators/utils'
import { RefreshControl } from 'react-native'
import backgroundImageBigUri from '@/Services/utils/backgroundImageBigUri'
import { meetingNotificationsApi } from '@/Services/modules/meeting-notifications'

type MeetingsOwnContainerParams = {
  meetingRole: string
}

const MeetingsOwnContainer = () => {
  const route =
    useRoute<RouteProp<Record<string, MeetingsOwnContainerParams>, string>>()
  const meetingRole = route.params.meetingRole

  const PAGE_SIZE = 10

  const [fetchedMeetings, setMeetings] = useState<Array<MeetingOwn>>([])
  const [isNextPageEmpty, setIsNextPageEmpty] = useState(false)

  const [offset, setOffset] = useState(0)

  const [activeStatuses, setActiveStatuses] = useState<Array<string>>([
    MeetingStatusesEnum.UPCOMING,
  ])

  const fetchMeetingsOwn = useFetchMeetingsOwnQuery({
    role: meetingRole,
    statuses: activeStatuses,
    limit: PAGE_SIZE,
    offset: offset,
  })

  const { data, isLoading, isFetching } = fetchMeetingsOwn

  const meetingsNotificationState =
    meetingNotificationsApi.endpoints.fetchMeetingNotifications.useQueryState(
      {},
    )

  const getNumberOfConnectedNotifications = (meetingId: string): number => {
    if (meetingsNotificationState.data) {
      return meetingsNotificationState.data.filter(
        notification => notification.meetingId === meetingId,
      ).length
    }
    return 0
  }

  useFocusEffect(
    React.useCallback(() => {
      // this executes when screen is focused
      return () => {
        // cleanup when screen is unfocused
        setOffset(0)
        setIsNextPageEmpty(false)
      }
    }, []),
  )

  useEffect(() => {
    if (data && data.length) {
      if (offset === 0) {
        setMeetings(data)
      } else {
        setMeetings(oldData => [...oldData, ...data])
      }
      if (data.length < PAGE_SIZE) {
        setIsNextPageEmpty(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Flex
      position={'relative'}
      flex={1}
      key={meetingRole}
      backgroundColor={'white'}
      px={3}
    >
      <Flex py={2}>
        <FilterCloudsList
          separatorWidth={2.5}
          onStatusChanged={activeStatusesArg => {
            setMeetings([])
            setOffset(0)
            setIsNextPageEmpty(false)
            setActiveStatuses(activeStatusesArg)
          }}
          statusesList={Object.values(MeetingStatusesEnum)}
          defaultSelected={MeetingStatusesEnum.UPCOMING}
          multiSelect={false}
          stretch={true}
        />
      </Flex>
      <Flex flex={1} pb={5}>
        <FlatList
          initialNumToRender={PAGE_SIZE}
          data={fetchedMeetings}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isFetching}
              onRefresh={() => {
                setOffset(0)
                setIsNextPageEmpty(false)
                fetchMeetingsOwn.refetch()
              }}
            />
          }
          renderItem={({ item }) => (
            <MeetingsPreview
              id={item.id}
              name={item.name}
              startDate={item.startDate}
              imageUri={backgroundImageBigUri(item.imageId)}
              notificationsCount={getNumberOfConnectedNotifications(item.id)}
            />
          )}
          onEndReached={() => {
            if (!isNextPageEmpty) {
              setOffset(offset + PAGE_SIZE)
            }
          }}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => {
            return <Flex height={2.5} />
          }}
        />
        {!isLoading && !fetchedMeetings.length && (
          <NothingToShowHere text="Nothing to show here yet" />
        )}
      </Flex>
      {meetingRole === MeetingRolesEnum.HOSTED && (
        <Fab
          renderInPortal={false}
          shadow={2}
          size={'lg'}
          icon={<AddIcon />}
          onPress={() => {
            navigate<MainNavigationRoutes.ADD_MEETING>(
              MainNavigationRoutes.ADD_MEETING,
              {},
            )
          }}
        />
      )}
    </Flex>
  )
}

export default MeetingsOwnContainer
