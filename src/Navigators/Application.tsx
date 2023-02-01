import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StartupContainer } from '@/Containers'
import AuthNavigation from '@/Navigators/AuthNavigation/AuthNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { authSlice, AuthState } from '@/Store/Auth'
import { navigationRef } from './utils'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import {
  loadingIndicatorSlice,
  LoadingIndicatorState,
} from '@/Store/LoadingIndicator'
import { useLazyFetchUsersMeQuery } from '@/Services/modules/users'
import FinishSignUpContainer from '@/Containers/FinishSignUpContainer'
import { Box } from 'native-base'
import { MainNavigation } from '@/Navigators/MainNavigation/MainNavigation'
import Geolocation from 'react-native-geolocation-service'
import { clientDataStore } from '@/Store/ClientData'
import { PermissionsAndroid, Platform } from 'react-native'
import { api } from '@/Services/api'
import { meetingNotificationsApi } from '@/Services/modules/meeting-notifications'

const ApplicationNavigator = () => {
  const authState = useSelector((state: { auth: AuthState }) => state.auth)
  const loadingIndicatorState = useSelector(
    (state: { loadingIndicator: LoadingIndicatorState }) =>
      state.loadingIndicator,
  )
  const dispatch = useDispatch()

  const [fetchUsersMe] = useLazyFetchUsersMeQuery()

  const [fetchMeetingNotifications] =
    meetingNotificationsApi.endpoints.fetchMeetingNotifications.useLazyQuery({
      pollingInterval: 15000,
    })

  useEffect(() => {
    const getUserLocation = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: 'M33TING.CLUB Location services',
            message: 'M33TING.CLUB needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        )
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'M33TING.CLUB Location services',
            message: 'M33TING.CLUB needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        )
      } else {
        await Geolocation.requestAuthorization('whenInUse')
      }
      Geolocation.getCurrentPosition(
        position => {
          console.log(position)
          dispatch(
            clientDataStore.actions.setUserLocation({
              userLocation: {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                name: 'Your location',
              },
            }),
          )
        },
        error => {
          console.log(error.code, error.message)
          dispatch(
            clientDataStore.actions.setUserLocation({
              userLocation: {
                coords: {
                  latitude: 0,
                  longitude: 0,
                },
                name: 'Unknown location',
              },
            }),
          )
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )
    }

    const init = async () => {
      dispatch(loadingIndicatorSlice.actions.setLoading())
      await getUserLocation()
      auth().onAuthStateChanged(async (user: FirebaseAuthTypes.User | null) => {
        console.log('AuthState Changed', user?.uid)
        if (user) {
          const token = await user.getIdToken()

          console.log(token)

          dispatch(
            authSlice.actions.setUser({
              user: {
                token,
              },
            }),
          )

          const fetchMeResponse = await fetchUsersMe(undefined)

          if (fetchMeResponse.data && fetchMeResponse.isSuccess) {
            dispatch(
              authSlice.actions.setUser({
                user: {
                  token,
                  userDetails: fetchMeResponse.data,
                },
              }),
            )
            fetchMeetingNotifications({})
          }
        } else {
          dispatch(
            authSlice.actions.setUser({
              user: undefined,
            }),
          )
          dispatch(api.util.resetApiState())
        }
        dispatch(loadingIndicatorSlice.actions.setLoaded())
      })
    }
    init()
  }, [dispatch, fetchUsersMe, fetchMeetingNotifications])

  return (
    <Box w={'100%'} flex={'1'} safeAreaTop>
      <NavigationContainer ref={navigationRef}>
        {loadingIndicatorState.isLoading ? (
          <StartupContainer />
        ) : (
          <>
            {authState.user?.token ? (
              <>
                {authState.user.userDetails ? (
                  <MainNavigation />
                ) : (
                  <FinishSignUpContainer />
                )}
              </>
            ) : (
              <AuthNavigation />
            )}
          </>
        )}
      </NavigationContainer>
    </Box>
  )
}

export default ApplicationNavigator
