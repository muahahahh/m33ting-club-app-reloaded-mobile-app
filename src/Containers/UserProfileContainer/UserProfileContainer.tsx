import React, { useEffect } from 'react'
import { Flex } from 'native-base'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { goBack, navigate } from '@/Navigators/utils'
import { UserDetails } from '@/Components/UserDetails/UserDetails'
import { userApi } from '@/Services/modules/users'
import { StackScreenProps } from '@react-navigation/stack'
import { MainNavigationParamList } from '@/Navigators/MainNavigation/MainNavigation'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import SpinnerModal from '@/Components/SpinnerModal'
import { useSelector } from 'react-redux'
import { AuthState } from '@/Store/Auth'
import { BottomTabsNavigationRoutes } from '@/Navigators/BottomTabsNavigation/bottomTabsNavigationRoutes'

export type UserProfileContainerProps = StackScreenProps<
  MainNavigationParamList,
  MainNavigationRoutes.USER_PROFILE
>

export const UserProfileContainer: React.FC<UserProfileContainerProps> = ({
  route: { params },
}) => {
  const fetchUserResponse = userApi.endpoints.fetchUser.useQuery({
    id: params.userId,
  })
  const authState = useSelector((state: { auth: AuthState }) => state.auth)

  useEffect(() => {
    if (authState.user?.userDetails?.id === params.userId) {
      navigate(BottomTabsNavigationRoutes.YOU, undefined)
    }
  }, [authState, params.userId])

  return (
    <Flex flex={1}>
      <ScreenTopHeader title={'User profile'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <SpinnerModal isOpen={fetchUserResponse.isLoading} />
      {fetchUserResponse.data && (
        <UserDetails
          id={fetchUserResponse.data.id}
          name={fetchUserResponse.data.name as string}
          gender={fetchUserResponse.data.gender as string}
          birthday={fetchUserResponse.data.birthday as string}
          imageId={fetchUserResponse.data.imageId as string}
          isMyProfile={authState.user?.userDetails?.id === params.userId}
          isFollowedByYou={fetchUserResponse.data.isFollowedByYou}
        />
      )}
    </Flex>
  )
}
