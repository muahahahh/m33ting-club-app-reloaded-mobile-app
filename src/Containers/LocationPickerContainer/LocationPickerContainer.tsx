import React, { useEffect, useState } from 'react'
import { Box, Flex, Button, Text, HStack } from 'native-base'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Dimensions, StyleSheet } from 'react-native'
import { LatLng } from '@/Store/utilityTypes'
import { Config } from '@/Config'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { goBack, navigate } from '@/Navigators/utils'
import { useSelector } from 'react-redux'
import { userLocationSelector } from '@/Store/ClientData/clientDataSelectors'
import { StackScreenProps } from '@react-navigation/stack'
import { MainNavigationParamList } from '@/Navigators/MainNavigation/MainNavigation'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { AppIcon } from '@/Components/AppIcon/AppIcon'

const styles = StyleSheet.create({
  map: {
    width: '100%',
    flexGrow: 1,
  },
})

export type PickUserLocationContainerProps = StackScreenProps<
  MainNavigationParamList,
  MainNavigationRoutes.PICK_USER_LOCATION
>

export const LocationPickerContainer: React.FC<
  PickUserLocationContainerProps
> = ({ route: { params } }) => {
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height

  const clientDataUserLocation = useSelector(userLocationSelector)

  const [pickedCoords, setPickedCoords] = useState<LatLng>({
    latitude:
      params.initCoords?.latitude || clientDataUserLocation.coords.latitude,
    longitude:
      params.initCoords?.longitude || clientDataUserLocation.coords.longitude,
  })

  const [locationName, setLocationName] = useState('')

  useEffect(() => {
    const getLocationName = async () => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickedCoords.latitude},${pickedCoords.longitude}&key=${Config.GOOGLE_MAPS_API_KEY}`,
      )
      if (response.status === 200) {
        const data = await response.json()
        setLocationName(data?.results[0]?.formatted_address || '')
      }
    }

    getLocationName()
  }, [pickedCoords.latitude, pickedCoords.longitude])

  return (
    <Flex w={width} h={height}>
      <ScreenTopHeader title={'Pick location'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <Box
        w={'100%'}
        top={0}
        bgColor={'white'}
        px={6}
        py={2}
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        borderBottomRadius={'lg'}
      >
        <Text>{locationName || 'Location name'}</Text>
      </Box>
      <Box
        w={'100%'}
        top={0}
        bgColor={'white'}
        px={6}
        py={1}
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        borderBottomRadius={'lg'}
      >
        <Text color={'muted.600'} textAlign={'center'}>
          {'Hold the pin to drag it'}
        </Text>
      </Box>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: pickedCoords.latitude,
          longitude: pickedCoords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          draggable
          coordinate={pickedCoords}
          onDragEnd={e => {
            setPickedCoords(e.nativeEvent.coordinate)
          }}
        />
      </MapView>
      <HStack
        width={width}
        justifyContent={'center'}
        position={'absolute'}
        bottom={100}
      >
        <TouchableOpacity
          onPress={() => {
            navigate(params.redirectTo, {
              location: { coords: pickedCoords, name: locationName },
            })
          }}
        >
          <Button>Save location</Button>
        </TouchableOpacity>
      </HStack>
    </Flex>
  )
}
