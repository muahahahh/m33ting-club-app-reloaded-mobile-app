import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MeetingsOwnContainer from '@/Containers/MeetingsOwnContainer/MeetingsOwnContainer'
import { MeetingRolesEnum } from '@/Services/enums/meetings/MeetingRolesEnum'
import { MeetingsOwnNavigationRoutes } from '@/Navigators/MeetingsOwnNavigation/meetingsOwnNavigationRoutes'
import { HStack, Text } from 'native-base'
import { NotificationBadge } from '@/Components/NotificationBadge'
import {
  meetingNotificationsApi,
  MeetingNotificationsSingleAPIResponse,
  MeetingNotificationTypeEnum,
} from '@/Services/modules/meeting-notifications'

export type MeetingOwnNavigationParamList = {
  [MeetingsOwnNavigationRoutes.HOSTED]: { meetingRole: MeetingRolesEnum }
  [MeetingsOwnNavigationRoutes.JOINED]: { meetingRole: MeetingRolesEnum }
}
const Tab = createMaterialTopTabNavigator<MeetingOwnNavigationParamList>()

const MeetingsOwnNavigation = () => {
  const meetingsNotificationState =
    meetingNotificationsApi.endpoints.fetchMeetingNotifications.useQueryState(
      {},
    )

  const [numberOfNotificationsForHost, setNumberOfNotificationsForHost] =
    useState(0)

  const [numberOfNotificationsForGuest, setNumberOfNotificationsForGuest] =
    useState(0)

  useEffect(() => {
    const getNumberOfNotificationsForHost = (
      notifications: MeetingNotificationsSingleAPIResponse[],
    ): number => {
      return notifications.filter(
        notification =>
          notification.type ===
            MeetingNotificationTypeEnum.USER_ASKED_TO_JOIN ||
          notification.type === MeetingNotificationTypeEnum.USER_JOINED,
      ).length
    }

    const getNumberOfNotificationsForGuest = (
      notifications: MeetingNotificationsSingleAPIResponse[],
    ): number => {
      return notifications.filter(
        notification =>
          notification.type ===
          MeetingNotificationTypeEnum.APPLICATION_ACCEPTED,
      ).length
    }

    if (meetingsNotificationState.data) {
      setNumberOfNotificationsForHost(
        getNumberOfNotificationsForHost(meetingsNotificationState.data),
      )
      setNumberOfNotificationsForGuest(
        getNumberOfNotificationsForGuest(meetingsNotificationState.data),
      )
    } else {
      setNumberOfNotificationsForHost(0)
      setNumberOfNotificationsForGuest(0)
    }
  }, [meetingsNotificationState.data])

  return (
    <Tab.Navigator screenOptions={{ lazy: true }}>
      <Tab.Screen
        name={MeetingsOwnNavigationRoutes.HOSTED}
        component={MeetingsOwnContainer}
        initialParams={{ meetingRole: MeetingRolesEnum.HOSTED }}
        options={{
          tabBarLabel: () => (
            <HStack alignItems={'center'} space={2}>
              <Text>{MeetingsOwnNavigationRoutes.HOSTED}</Text>
              {numberOfNotificationsForHost ? (
                <NotificationBadge badge={`${numberOfNotificationsForHost}`} />
              ) : null}
            </HStack>
          ),
        }}
      />
      <Tab.Screen
        name={MeetingsOwnNavigationRoutes.JOINED}
        component={MeetingsOwnContainer}
        initialParams={{ meetingRole: MeetingRolesEnum.JOINED }}
        options={{
          tabBarLabel: () => (
            <HStack alignItems={'center'} space={2}>
              <Text>{MeetingsOwnNavigationRoutes.JOINED}</Text>
              {numberOfNotificationsForGuest ? (
                <NotificationBadge badge={`${numberOfNotificationsForGuest}`} />
              ) : null}
            </HStack>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default MeetingsOwnNavigation
