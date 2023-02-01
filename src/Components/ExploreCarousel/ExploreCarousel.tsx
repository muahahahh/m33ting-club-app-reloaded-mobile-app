import React, { useEffect, useState } from 'react'
import { Flex, Heading, HStack, FlatList, Button, VStack } from 'native-base'

import { Dimensions } from 'react-native'
import {
  GetMeetingsAPIResponse,
  GetMeetingsSingleMeetingAPIResponse,
  meetingsApi,
} from '@/Services/modules/meetings'
import { Location } from '@/Store/ClientData'
import { isValidNotEmptyArray } from '@/Utilities/utils'
import { MeetingRepresentativeCard } from '@/Components/MeetingRepresentativeCard/MeetingRepresentativeCard'
import { useIsFocused } from '@react-navigation/native'
import { usePrevious } from '@/Hooks/usePrevious'

const PAGE_SIZE = 2

export interface ExploreCarouselProps {
  locationFilter: Location
  tagsFilter: string[]
}

export const ExploreCarousel: React.FC<ExploreCarouselProps> = ({
  locationFilter,
  tagsFilter,
}) => {
  const slideHeight = Dimensions.get('window').height * 0.65

  const [combinedMeetings, setCombinedMeetings] = useState<
    GetMeetingsSingleMeetingAPIResponse[]
  >([])
  const [offset, setOffset] = useState(0)
  const [isNextPageEmpty, setIsNextPageEmpty] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const isFocused = useIsFocused()

  const getMeetingsQueryResponse = meetingsApi.endpoints.getMeetings.useQuery({
    offset,
    limit: PAGE_SIZE,
    latitude: locationFilter ? locationFilter.coords.latitude : 0,
    longitude: locationFilter ? locationFilter.coords.longitude : 0,
    tags: tagsFilter ? tagsFilter : [],
  })

  const previousRequestId = usePrevious(getMeetingsQueryResponse.requestId)

  const { records: fetchedMeetings } =
    (getMeetingsQueryResponse?.data as GetMeetingsAPIResponse) || {}

  useEffect(() => {
    setCombinedMeetings([])
    setOffset(0)
  }, [
    locationFilter.coords.longitude,
    locationFilter.coords.latitude,
    tagsFilter,
  ])

  useEffect(() => {
    if (isValidNotEmptyArray(fetchedMeetings)) {
      setCombinedMeetings(previousState => [
        ...previousState,
        ...fetchedMeetings,
      ])
    }

    if (fetchedMeetings && fetchedMeetings.length < PAGE_SIZE) {
      setIsNextPageEmpty(true)
    }
  }, [fetchedMeetings, refreshCounter])

  useEffect(() => {
    if (
      !isFocused &&
      previousRequestId !== getMeetingsQueryResponse.requestId
    ) {
      setCombinedMeetings([])
      setOffset(0)
    }
  }, [getMeetingsQueryResponse.requestId, isFocused, previousRequestId])

  return (
    <Flex flex={1}>
      <FlatList
        onRefresh={() => {
          setCombinedMeetings([])
          setOffset(0)
          setRefreshCounter(prevState => prevState + 1)
          getMeetingsQueryResponse.refetch()
        }}
        refreshing={getMeetingsQueryResponse.isLoading}
        keyExtractor={item => item.id}
        data={combinedMeetings}
        onEndReachedThreshold={0.5}
        renderItem={({ item: meeting }) => {
          return (
            <MeetingRepresentativeCard
              meeting={meeting}
              cardHeight={slideHeight}
            />
          )
        }}
        onEndReached={() => {
          if (combinedMeetings.length === offset + PAGE_SIZE) {
            setOffset(prevState => prevState + PAGE_SIZE)
          }
        }}
        ListFooterComponent={() => {
          if (isNextPageEmpty) {
            return (
              <VStack
                space={2}
                justifyContent="center"
                my={8}
                alignItems={'center'}
              >
                <Heading color="primary.500" fontSize="md">
                  That's all :)
                </Heading>
                {combinedMeetings.length === 0 && (
                  <Button
                    onPress={() => {
                      setOffset(0)
                      setRefreshCounter(prevState => prevState + 1)
                      getMeetingsQueryResponse.refetch()
                    }}
                  >
                    Refresh
                  </Button>
                )}
              </VStack>
            )
          } else {
            return <HStack space={2} justifyContent="center" my={8} />
          }
        }}
      />
    </Flex>
  )
}
