import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabsNavigationRoutes } from '@/Navigators/BottomTabsNavigation/bottomTabsNavigationRoutes'
import ExploreContainer from '@/Containers/ExploreContainer/ExploreContainer'
import { YouContainer } from '@/Containers/YouContainer/YouContainer'
import { Location } from '@/Store/ClientData'
import MeetingsOwnNavigation, {
  MeetingOwnNavigationParamList,
} from '@/Navigators/MeetingsOwnNavigation/MeetingsOwnNavigation'
import { NavigatorScreenParams } from '@react-navigation/native'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { Platform } from 'react-native'
import { PickedTag } from '@/Components/TagCloud/TagCloud'
import FeedContainer from '@/Containers/FeedContainer/FeedContainer'
import { meetingNotificationsApi } from '@/Services/modules/meeting-notifications'

export type BottomTabsNavigationParamList = {
  [BottomTabsNavigationRoutes.EXPLORE]: {
    location?: Location
    pickedTags?: PickedTag[]
  }
  [BottomTabsNavigationRoutes.YOUR_MEETINGS]: NavigatorScreenParams<MeetingOwnNavigationParamList>
  [BottomTabsNavigationRoutes.FEED]: undefined
  [BottomTabsNavigationRoutes.YOU]: undefined
}

const Tab = createBottomTabNavigator<BottomTabsNavigationParamList>()

const BottomTabsNavigation = () => {
  const meetingsNotificationState =
    meetingNotificationsApi.endpoints.fetchMeetingNotifications.useQueryState(
      {},
    )

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          ...(Platform.OS === 'android'
            ? { height: 57, paddingBottom: 5 }
            : {}),
        },
      }}
    >
      <Tab.Screen
        name={BottomTabsNavigationRoutes.EXPLORE}
        component={ExploreContainer}
        options={{
          tabBarIcon: () => {
            return <AppIcon iconName={'compass-outline'} />
          },
          tabBarLabel: 'Explore',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={BottomTabsNavigationRoutes.FEED}
        component={FeedContainer}
        options={{
          tabBarIcon: () => {
            return <AppIcon iconName={'flash-outline'} />
          },
          tabBarLabel: 'Feed',
          headerShown: false,
          tabBarIconStyle: {},
        }}
      />
      <Tab.Screen
        name={BottomTabsNavigationRoutes.YOUR_MEETINGS}
        component={MeetingsOwnNavigation}
        options={{
          tabBarIcon: () => {
            return <AppIcon iconName={'briefcase-outline'} />
          },
          tabBarLabel: 'Your meetings',
          headerShown: false,
          ...(meetingsNotificationState.data &&
          meetingsNotificationState.data.length
            ? { tabBarBadge: meetingsNotificationState.data.length }
            : {}),
        }}
      />
      <Tab.Screen
        name={BottomTabsNavigationRoutes.YOU}
        component={YouContainer}
        options={{
          tabBarIcon: () => {
            return <AppIcon iconName={'person-outline'} />
          },
          tabBarLabel: 'You',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabsNavigation
