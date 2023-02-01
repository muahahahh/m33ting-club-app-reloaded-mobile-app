/**
 * Used to navigating without the navigation prop
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 *
 * You can add other navigation functions that you need and export them
 */
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native'
import { MainNavigationParamList } from '@/Navigators/MainNavigation/MainNavigation'
import { AuthNavigationParamList } from '@/Navigators/AuthNavigation/AuthNavigation'
import { BottomTabsNavigationParamList } from '@/Navigators/BottomTabsNavigation/BottomTabsNavigation'
import { MeetingOwnNavigationParamList } from '@/Navigators/MeetingsOwnNavigation/MeetingsOwnNavigation'

export type RootStackParamList = MainNavigationParamList &
  AuthNavigationParamList &
  BottomTabsNavigationParamList &
  MeetingOwnNavigationParamList

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate<any>(name, params)
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack()
  }
}

export function navigateAndReset(routes = [], index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    )
  }
}

export function navigateAndSimpleReset(name: string, index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{ name }],
      }),
    )
  }
}
