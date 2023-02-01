import { followershipNavigationRoutes } from '@/Navigators/FollowershipNavigation/folowershipNavigationRoutes'
import {
  useFetchFollowersQuery,
  useFetchFollowingQuery,
} from '@/Services/modules/users'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { goBack, navigate } from '@/Navigators/utils'
import { Avatar, Flex, HStack, Pressable, Text } from 'native-base'
import { FlatList, RefreshControl } from 'react-native'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import React, { useEffect, useState } from 'react'
import { FollowingSingleAPIResponse } from '@/Services/modules/users/fetchFollowers'
import { RouteProp, useRoute } from '@react-navigation/native'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import userImageUri from '@/Services/utils/userImageUri'

export type FollowershipParams = {
  userId: string
  type: string
}

const Followership: React.FC = () => {
  const route =
    useRoute<RouteProp<Record<string, FollowershipParams>, string>>()
  const userId = route.params.userId
  const type = route.params.type

  const [users, setUsers] = useState<Array<FollowingSingleAPIResponse>>([])

  const fetchFollowingUsers = useFetchFollowingQuery({ id: userId })
  const fetchFollowedUsers = useFetchFollowersQuery({ id: userId })

  const { data, isFetching, isLoading } =
    type === followershipNavigationRoutes.FOLLOWING
      ? fetchFollowingUsers
      : fetchFollowedUsers

  useEffect(() => {
    if (data && data.records) {
      setUsers(data.records)
    } else {
      setUsers([])
    }
  }, [data])

  return (
    <Flex flex={1}>
      <ScreenTopHeader title={type}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <Flex flex={1} width={'100%'} px={5}>
        <FlatList
          data={users}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isFetching}
              onRefresh={() => {
                type === followershipNavigationRoutes.FOLLOWERS
                  ? fetchFollowingUsers.refetch()
                  : fetchFollowedUsers.refetch()
              }}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigate<MainNavigationRoutes.USER_PROFILE>(
                  MainNavigationRoutes.USER_PROFILE,
                  { userId: item.userId },
                )
              }
            >
              <HStack width={'100%'} py={2} mr={'auto'} flex={1}>
                <Avatar
                  size={'md'}
                  bg={'muted.400'}
                  borderColor={'white'}
                  borderWidth={0.5}
                  source={{
                    uri: userImageUri(item.userImageId),
                  }}
                >
                  <AppIcon iconName={'person'} size={30} color={'#FFFFFF'} />
                </Avatar>
                <Flex textAlign={'left'} my={'auto'} ml={5} flex={3}>
                  <Text
                    fontSize={'lg'}
                    textAlign={'left'}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                  >
                    {item.userName}
                  </Text>
                </Flex>
              </HStack>
            </Pressable>
          )}
          ItemSeparatorComponent={() => {
            return (
              <Flex
                borderBottomColor={'coolGray.300'}
                borderBottomWidth={'1px'}
              />
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

export default Followership
