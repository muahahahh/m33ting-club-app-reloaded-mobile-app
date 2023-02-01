import { createStackNavigator } from '@react-navigation/stack'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import React from 'react'
import BottomTabsNavigation, {
  BottomTabsNavigationParamList,
} from '@/Navigators/BottomTabsNavigation/BottomTabsNavigation'
import { NavigatorScreenParams } from '@react-navigation/native'
import { LocationPickerContainer } from '@/Containers/LocationPickerContainer/LocationPickerContainer'
import { RootStackParamList } from '@/Navigators/utils'
import { LatLng } from '@/Store/utilityTypes'
import AddMeetingContainer from '@/Containers/AddMeetingContainer'
import { Location } from '@/Store/ClientData'
import { TagsSearchContainer } from '@/Containers/TagsSearchContainer/TagsSearchContainer'
import MeetingDetailsContainer from '@/Containers/MeetingDetailsContainer/MeetingDetailsContainer'
import ParticipantsContainer from '@/Containers/ParticipantsContainer'
import { Participant } from '@/Services/modules/meetings/fetchMeeting'
import ApplicationsContainer from '@/Containers/ApplicationsContainer'
import { PickedTag } from '@/Components/TagCloud/TagCloud'
import { UserProfileContainer } from '@/Containers/UserProfileContainer/UserProfileContainer'
import EditMeetingContainer from '@/Containers/EditMeetingContainer'
import Followership, {
  FollowershipParams,
} from '@/Components/Followership/Followership'

export type MainNavigationParamList = {
  [MainNavigationRoutes.BOTTOM_TABS_NAVIGATION]: NavigatorScreenParams<BottomTabsNavigationParamList>
  [MainNavigationRoutes.MEETING_DETAILS_VIEW]: { meetingId: string }
  [MainNavigationRoutes.PARTICIPANTS]: {
    participants: Array<Participant>
  }
  [MainNavigationRoutes.APPLICATIONS]: {
    meetingId: string
  }
  [MainNavigationRoutes.PICK_USER_LOCATION]: {
    redirectTo: keyof RootStackParamList
    initCoords?: LatLng
  }
  [MainNavigationRoutes.ADD_MEETING]: {
    location?: Location
    pickedTags?: PickedTag[]
  }
  [MainNavigationRoutes.SEARCH_TAGS]: {
    redirectTo: keyof RootStackParamList
    initTags?: PickedTag[]
    acceptNewTags: boolean
  }
  [MainNavigationRoutes.EDIT_MEETING]: {
    meetingId: string
    pickedTags?: PickedTag[]
  }
  [MainNavigationRoutes.USER_PROFILE]: {
    userId: string
  }
  [MainNavigationRoutes.FOLLOWERSHIP]: FollowershipParams
}

const { Navigator, Screen } = createStackNavigator<MainNavigationParamList>()

export const MainNavigation: React.FC = () => {
  return (
    <Navigator>
      <Screen
        name={MainNavigationRoutes.BOTTOM_TABS_NAVIGATION}
        component={BottomTabsNavigation}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.MEETING_DETAILS_VIEW}
        component={MeetingDetailsContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.PARTICIPANTS}
        component={ParticipantsContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.APPLICATIONS}
        component={ApplicationsContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.PICK_USER_LOCATION}
        component={LocationPickerContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.ADD_MEETING}
        component={AddMeetingContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.SEARCH_TAGS}
        component={TagsSearchContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.EDIT_MEETING}
        component={EditMeetingContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.USER_PROFILE}
        component={UserProfileContainer}
        options={{ headerShown: false }}
      />
      <Screen
        name={MainNavigationRoutes.FOLLOWERSHIP}
        component={Followership}
        options={{ headerShown: false }}
      />
    </Navigator>
  )
}
