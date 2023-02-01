import React, { useEffect, useState } from 'react'
import { Box, Flex, HStack, Input, Text, Button, FlatList } from 'native-base'
import { TouchableOpacity } from 'react-native'
import {
  GetSearchTagsAPIResponse,
  GetSearchTagsSingleAPIResponse,
  tagsApi,
} from '@/Services/modules/tags'
import { StackScreenProps } from '@react-navigation/stack'
import { MainNavigationParamList } from '@/Navigators/MainNavigation/MainNavigation'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { navigate } from '@/Navigators/utils'
import { usePrevious } from '@/Hooks/usePrevious'
import { PickedTag, TagCloud } from '@/Components/TagCloud/TagCloud'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'

export type TagsSearchContainerProps = StackScreenProps<
  MainNavigationParamList,
  MainNavigationRoutes.SEARCH_TAGS
>

const PAGE_SIZE = 15

export const TagsSearchContainer: React.FC<TagsSearchContainerProps> = ({
  route: { params },
}) => {
  const [pickedTags, setPickedTags] = useState<PickedTag[]>(
    params.initTags || [],
  )

  const [tagsPhraseFilter, setTagsPhraseFilter] = useState('')
  const previousTagsPhraseFilter = usePrevious(tagsPhraseFilter)

  const [offset, setOffset] = useState(0)
  const previousOffset = usePrevious(offset)

  const [isNextPageEmpty, setIsNextPageEmpty] = useState(false)

  const [fetchTags, fetchTagsResponse] =
    tagsApi.endpoints.searchTags.useLazyQuery()

  const [combinedTags, setCombinedTags] = useState<
    GetSearchTagsSingleAPIResponse[]
  >([])

  useEffect(() => {
    const loadTagsAfterOffsetChange = async (hasPhraseChanged: boolean) => {
      const fetchTagsResult = await fetchTags({
        limit: PAGE_SIZE,
        offset,
        ...(tagsPhraseFilter ? { phrase: tagsPhraseFilter } : {}),
      })

      const { records: fetchedTags } =
        (fetchTagsResult.data as GetSearchTagsAPIResponse) || {}

      if (fetchedTags) {
        if (hasPhraseChanged) {
          setCombinedTags(fetchedTags)
        } else {
          setCombinedTags(prevState => [...prevState, ...fetchedTags])
        }
        setIsNextPageEmpty(fetchedTags.length < PAGE_SIZE)
      }
    }

    if (previousTagsPhraseFilter !== tagsPhraseFilter) {
      setOffset(0)
      loadTagsAfterOffsetChange(true)
    } else if (previousOffset !== offset) {
      loadTagsAfterOffsetChange(false)
    }
  }, [
    previousOffset,
    fetchTags,
    offset,
    tagsPhraseFilter,
    previousTagsPhraseFilter,
  ])

  const removeTagsFromFilter = (tagToRemove: string) => {
    setPickedTags(prevState => [
      ...prevState.filter(tag => tag.name !== tagToRemove),
    ])
  }

  return (
    <Flex backgroundColor={'white'} flex={1} position={'relative'}>
      <ScreenTopHeader title={'Search for tags'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            navigate(params.redirectTo, {
              pickedTags: undefined,
            })
          }}
        />
      </ScreenTopHeader>
      <Flex flex={1} my={1} mx={1}>
        <Input
          borderRadius={'lg'}
          p={3}
          bgColor={'light.100'}
          borderColor={'light.400'}
          borderWidth={1}
          placeholder={'Sport ...'}
          fontSize={'sm'}
          value={tagsPhraseFilter}
          onChangeText={val => setTagsPhraseFilter(val.toLowerCase())}
          mb={1}
          autoCapitalize={'none'}
        />
        <Box flexDirection={'row'} flexWrap={'wrap'}>
          {pickedTags.map((item, index) => {
            return (
              <TagCloud
                key={index}
                tag={item}
                onPress={() => removeTagsFromFilter(item.name)}
              />
            )
          })}
        </Box>
        <HStack my={2}>
          <AppIcon iconName={'star-outline'} size={18} />
          <Text color={'muted.500'}> - Means that this is official tag</Text>
        </HStack>
        <Flex flex={1}>
          <FlatList
            refreshing={fetchTagsResponse.isLoading}
            initialNumToRender={PAGE_SIZE}
            ItemSeparatorComponent={() => (
              <Box h={'1px'} bgColor={'coolGray.200'} />
            )}
            onEndReached={() => {
              if (!isNextPageEmpty) {
                setOffset(prevState => prevState + PAGE_SIZE)
              }
            }}
            data={
              params.acceptNewTags &&
              tagsPhraseFilter.length &&
              !combinedTags.find(
                tag => tag.name.toLowerCase() === tagsPhraseFilter,
              )
                ? [
                    ...combinedTags,
                    { name: tagsPhraseFilter, id: 'newTag', isOfficial: false },
                  ]
                : combinedTags
            }
            renderItem={({ item: tag }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      !pickedTags.filter(
                        pickedTag => pickedTag.name === tag.name,
                      ).length
                    ) {
                      setPickedTags(prevState => [
                        ...prevState,
                        { name: tag.name, isOfficial: tag.isOfficial },
                      ])
                    }
                  }}
                >
                  <HStack py={3} space={3} alignItems={'center'}>
                    <Text
                      fontSize={'md'}
                      opacity={
                        pickedTags.filter(
                          pickedTag => pickedTag.name === tag.name,
                        ).length
                          ? 0.4
                          : 1
                      }
                    >
                      # {tag.name}
                    </Text>
                    {tag.isOfficial && (
                      <AppIcon iconName={'star-outline'} size={18} />
                    )}
                    {tag.id === 'newTag' && (
                      <Text italic={true} color={'muted.500'}>
                        Tap to add
                      </Text>
                    )}
                  </HStack>
                </TouchableOpacity>
              )
            }}
          />
        </Flex>
      </Flex>
      <HStack
        width={'100%'}
        justifyContent={'center'}
        py={6}
        borderColor="coolGray.200"
        borderWidth="1"
      >
        <Button
          onPress={() => {
            navigate(params.redirectTo, {
              pickedTags,
            })
          }}
        >
          Save tags
        </Button>
      </HStack>
    </Flex>
  )
}
