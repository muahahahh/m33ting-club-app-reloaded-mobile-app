import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SignInContainer from '@/Containers/SignInContainer'
import { AuthNavigationRoutes } from '@/Navigators/AuthNavigation/authNavigationRoutes'

export type AuthNavigationParamList = {
  [AuthNavigationRoutes.SIGN_IN]: undefined
}

const { Navigator, Screen } = createStackNavigator<AuthNavigationParamList>()

const AuthNavigation: React.FC = () => {
  return (
    <Navigator
      screenOptions={{
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerTitle: '',
      }}
    >
      <Screen name={AuthNavigationRoutes.SIGN_IN} component={SignInContainer} />
    </Navigator>
  )
}

export default AuthNavigation
