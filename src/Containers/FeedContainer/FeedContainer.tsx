import React, { useEffect, useState } from 'react'
import { FlatList, Flex, Heading, HStack } from 'native-base'
import {
  GetFeedAPIResponse,
  MeetingFeed,
} from '@/Services/modules/meetings/fetchMeetingsFeed'
import { useFetchMeetingsFeedQuery } from '@/Services/modules/meetings'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import FeedPreview from '@/Components/FeedPreview/FeedPreview'
import { isValidNotEmptyArray } from '@/Utilities/utils'

const PAGE_SIZE = 8

const FeedContainer: React.FC = () => {
  const [combinedFeed, setCombinedFeed] = useState<Array<MeetingFeed>>([])
  const [offset, setOffset] = useState(0)
  const [isNextPageEmpty, setIsNextPageEmpty] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const fetchMeetingsFeedQuery = useFetchMeetingsFeedQuery({
    limit: PAGE_SIZE,
    offset: offset,
  })

  const { records: fetchedRecords } =
    (fetchMeetingsFeedQuery?.data as GetFeedAPIResponse) || {}

  useEffect(() => {
    if (isValidNotEmptyArray(fetchedRecords)) {
      setCombinedFeed(oldData => [...oldData, ...fetchedRecords])
    }

    if (fetchedRecords && fetchedRecords.length < PAGE_SIZE) {
      setIsNextPageEmpty(true)
    } else {
      setIsNextPageEmpty(false)
    }
  }, [fetchedRecords, refreshCounter])

  return (
    <Flex flex={1} backgroundColor={'white'}>
      <ScreenTopHeader title={'Feed'} />
      <Flex px={3} py={1.5} flex={1}>
        <FlatList
          flex={1}
          onRefresh={() => {
            setCombinedFeed([])
            setOffset(0)
            setRefreshCounter(prevState => prevState + 1)
            fetchMeetingsFeedQuery.refetch()
          }}
          refreshing={
            fetchMeetingsFeedQuery.isLoading ||
            fetchMeetingsFeedQuery.isFetching
          }
          initialNumToRender={PAGE_SIZE}
          data={combinedFeed}
          onEndReachedThreshold={0.7}
          renderItem={({ item }) => (
            <FeedPreview
              userImageId={item.userImageId}
              userName={item.userName}
              meetingRole={item.meetingRole}
              meetingId={item.meetingId}
              meetingName={item.meetingName}
              occuredOn={item.occuredOn}
            />
          )}
          onEndReached={() => {
            console.log('reached')
            if (combinedFeed.length === offset + PAGE_SIZE) {
              setOffset(prevState => prevState + PAGE_SIZE)
            }
          }}
          ItemSeparatorComponent={() => {
            return <Flex height={1.5} />
          }}
          ListFooterComponent={() => {
            if (isNextPageEmpty) {
              return (
                <HStack space={2} justifyContent="center" my={8}>
                  <Heading color="primary.500" fontSize="md">
                    That's all :)
                  </Heading>
                </HStack>
              )
            } else {
              return <HStack space={2} justifyContent="center" my={8} />
            }
          }}
        />
      </Flex>
    </Flex>
  )
}

export default FeedContainer
