import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from 'native-base'
import { ExploreCarousel } from '@/Components/ExploreCarousel/ExploreCarousel'
import { Animated, Dimensions } from 'react-native'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { BottomTabsNavigationParamList } from '@/Navigators/BottomTabsNavigation/BottomTabsNavigation'
import { BottomTabsNavigationRoutes } from '@/Navigators/BottomTabsNavigation/bottomTabsNavigationRoutes'
import { useSelector } from 'react-redux'
import { userLocationSelector } from '@/Store/ClientData/clientDataSelectors'
import ExploreContainerStyles from '@/Containers/ExploreContainer/ExploreContainer.styles'
import { PickedTag, TagCloud } from '@/Components/TagCloud/TagCloud'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'

type ExploreContainerProps = BottomTabScreenProps<
  BottomTabsNavigationParamList,
  BottomTabsNavigationRoutes.EXPLORE
>

const ExploreContainer: React.FC<ExploreContainerProps> = ({
  route: { params },
}) => {
  const screenWidth = Dimensions.get('window').width

  const clientDataUserLocation = useSelector(userLocationSelector)

  const [filtersOpen, setFiltersOpen] = useState(false)

  const [draftLocationFilter, setDraftLocationFilter] = useState(
    clientDataUserLocation,
  )
  const [draftTagsFilter, setDraftTagsFilter] = useState<PickedTag[]>([])

  const [locationFilter, setLocationFilter] = useState(clientDataUserLocation)
  const [tagsFilter, setTagsFilter] = useState<string[]>([])

  const [areFiltersToApply, setAreFiltersToApply] = useState(false)

  const filtersContainerTopAnimation = useRef(new Animated.Value(-420))
  const filtersIconTransformAnimation = useRef(new Animated.Value(0))

  const filtersIconTransformRotateValue =
    filtersIconTransformAnimation.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })

  useEffect(() => {
    if (filtersOpen) {
      Animated.timing(filtersContainerTopAnimation.current, {
        useNativeDriver: false,
        toValue: 60,
        duration: 300,
      }).start()
      Animated.timing(filtersIconTransformAnimation.current, {
        useNativeDriver: false,
        toValue: 1,
        duration: 300,
      }).start()
    } else {
      Animated.timing(filtersContainerTopAnimation.current, {
        useNativeDriver: false,
        toValue: -360,
        duration: 300,
      }).start()
      Animated.timing(filtersIconTransformAnimation.current, {
        useNativeDriver: false,
        toValue: 0,
        duration: 300,
      }).start()
    }
  }, [filtersOpen, filtersContainerTopAnimation])

  useEffect(() => {
    if (params?.location) {
      setDraftLocationFilter(params.location)
    }
    if (params?.pickedTags) {
      setDraftTagsFilter(params.pickedTags)
    }
  }, [params?.location, params?.pickedTags])

  useEffect(() => {
    const checkWhetherAreFiltersToApply = () =>
      JSON.stringify(draftTagsFilter) !== JSON.stringify(tagsFilter) ||
      JSON.stringify(draftLocationFilter) !== JSON.stringify(locationFilter)

    setAreFiltersToApply(checkWhetherAreFiltersToApply())
  }, [draftLocationFilter, locationFilter, draftTagsFilter, tagsFilter])

  const applyFilters = () => {
    setLocationFilter(draftLocationFilter)
    setTagsFilter(draftTagsFilter.map(tag => tag.name))
    setFiltersOpen(false)
  }

  const removeTagsFromFilter = (tagToRemove: string) => {
    setDraftTagsFilter(prevState => [
      ...prevState.filter(tag => tag.name !== tagToRemove),
    ])
  }

  return (
    <Box flex={1}>
      <ScreenTopHeader title={'Explore'} zIndex={100}>
        <Animated.View
          style={{ transform: [{ rotate: filtersIconTransformRotateValue }] }}
        >
          <AppIcon
            iconName={'filter-outline'}
            size={27}
            onPress={() => setFiltersOpen(prevState => !prevState)}
          />
        </Animated.View>
      </ScreenTopHeader>
      <Animated.View
        style={{
          ...ExploreContainerStyles.animatedFiltersBar,
          top: filtersContainerTopAnimation.current,
        }}
      >
        <Box
          w={screenWidth}
          height={'100%'}
          bg={'white'}
          borderBottomRadius={'lg'}
          overflow="hidden"
          borderColor="coolGray.300"
          borderWidth="1"
        >
          <VStack px={3} py={3} justifyContent={'space-between'} h={'100%'}>
            <VStack>
              <VStack mb={3}>
                <Heading size={'sm'} mb={2}>
                  Location
                </Heading>
                <HStack alignItems={'center'} space={3}>
                  <Box flexGrow={1}>
                    <Input
                      borderRadius={'lg'}
                      p={3}
                      bgColor={'light.100'}
                      borderColor={'light.400'}
                      borderWidth={1}
                      value={draftLocationFilter.name}
                      fontSize={'sm'}
                      onFocus={() =>
                        navigate<MainNavigationRoutes.PICK_USER_LOCATION>(
                          MainNavigationRoutes.PICK_USER_LOCATION,
                          {
                            redirectTo: BottomTabsNavigationRoutes.EXPLORE,
                            initCoords: draftLocationFilter.coords,
                          },
                        )
                      }
                    />
                  </Box>
                  <Button
                    onPress={() =>
                      navigate<MainNavigationRoutes.PICK_USER_LOCATION>(
                        MainNavigationRoutes.PICK_USER_LOCATION,
                        {
                          redirectTo: BottomTabsNavigationRoutes.EXPLORE,
                          initCoords: draftLocationFilter.coords,
                        },
                      )
                    }
                  >
                    <HStack alignItems={'center'} space={2} px={2}>
                      <Text color={'white'}>Pick location</Text>
                      <AppIcon iconName={'locate'} color={'#FFFFFF'} />
                    </HStack>
                  </Button>
                </HStack>
              </VStack>
              <VStack>
                <Heading size={'sm'} mb={2}>
                  Tags
                </Heading>
                <HStack alignItems={'center'} space={3}>
                  <Box flexGrow={1} mb={2}>
                    <Input
                      borderRadius={'lg'}
                      p={3}
                      bgColor={'light.100'}
                      borderColor={'light.400'}
                      borderWidth={1}
                      placeholder={'Sport ...'}
                      fontSize={'sm'}
                      onFocus={() =>
                        navigate<MainNavigationRoutes.SEARCH_TAGS>(
                          MainNavigationRoutes.SEARCH_TAGS,
                          {
                            redirectTo: BottomTabsNavigationRoutes.EXPLORE,
                            acceptNewTags: false,
                          },
                        )
                      }
                    />
                  </Box>
                </HStack>
                <Flex flexDirection={'row'} flexWrap={'wrap'}>
                  {draftTagsFilter.map((item, index) => {
                    return (
                      <TagCloud
                        tag={item}
                        onPress={() => removeTagsFromFilter(item.name)}
                        key={index}
                      />
                    )
                  })}
                </Flex>
              </VStack>
            </VStack>
            <HStack justifyContent={'center'} w={'100%'}>
              <Button
                onPress={() => applyFilters()}
                disabled={!areFiltersToApply}
                bgColor={areFiltersToApply ? 'primary.600' : 'muted.400'}
              >
                Apply filters
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Animated.View>
      <ExploreCarousel
        locationFilter={locationFilter}
        tagsFilter={tagsFilter}
      />
    </Box>
  )
}

export default ExploreContainer
