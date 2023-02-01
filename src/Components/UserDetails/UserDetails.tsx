import React from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Pressable,
  Stack,
  Text,
} from 'native-base'
import AvatarCustomized from '@/Components/AvatarCustomized'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { userApi } from '@/Services/modules/users'
import SpinnerModal from '@/Components/SpinnerModal'
import userImageUri from '@/Services/utils/userImageUri'
import dobToAgeFormatter from '@/Services/utils/dobToAgeFormatter'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { followershipNavigationRoutes } from '@/Navigators/FollowershipNavigation/folowershipNavigationRoutes'

export type UserDetailsProps = {
  id: string
  name: string
  gender: string
  birthday: string
  imageId: string | undefined
  isMyProfile?: boolean
  isFollowedByYou?: boolean
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  id,
  name,
  gender,
  birthday,
  isMyProfile = false,
  imageId,
  isFollowedByYou,
}) => {
  const fetchFollowing = userApi.endpoints.fetchFollowing.useQuery({ id })
  const fetchFollowers = userApi.endpoints.fetchFollowers.useQuery({ id })
  const [mutationFollow] = userApi.endpoints.mutationFollow.useMutation()
  const [mutationUnfollow] = userApi.endpoints.mutationUnfollow.useMutation()

  const handleFollowUnfollow = async () => {
    if (isFollowedByYou) {
      await mutationUnfollow({ id })
    } else {
      await mutationFollow({ id })
    }
  }

  if (
    fetchFollowing.isLoading ||
    !fetchFollowing.data ||
    fetchFollowers.isLoading ||
    !fetchFollowers.data
  ) {
    return <SpinnerModal isOpen={true} />
  }
  return (
    <Flex flex={1}>
      <Flex
        bgColor={'muted.100'}
        py={10}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <AvatarCustomized
          size={'2xl'}
          imageUri={imageId ? userImageUri(imageId) : undefined}
        />
        <Box mt={6}>
          <Heading>{name}</Heading>
        </Box>
        <HStack space={12} mt={4}>
          <Pressable
            onPress={() => {
              navigate<MainNavigationRoutes.FOLLOWERSHIP>(
                MainNavigationRoutes.FOLLOWERSHIP,
                { userId: id, type: followershipNavigationRoutes.FOLLOWING },
              )
            }}
          >
            <Text fontWeight={'500'} fontSize={15}>
              {fetchFollowing.data.totalNumberOfRecords} Followings
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigate<MainNavigationRoutes.FOLLOWERSHIP>(
                MainNavigationRoutes.FOLLOWERSHIP,
                { userId: id, type: followershipNavigationRoutes.FOLLOWERS },
              )
            }
          >
            <Text fontWeight={'500'} fontSize={15}>
              {fetchFollowers.data.totalNumberOfRecords} Followers
            </Text>
          </Pressable>
        </HStack>
        {!isMyProfile && (
          <Box mt={6}>
            <Button
              px={10}
              variant={'outline'}
              onPress={() => handleFollowUnfollow()}
            >
              {isFollowedByYou ? 'Unfollow' : 'Follow'}
            </Button>
          </Box>
        )}
      </Flex>
      <Flex m={4} flex={1}>
        <Flex>
          <Stack>
            <Text color={'muted.500'} mb={1} fontSize={12}>
              Gender
            </Text>
            <HStack alignItems={'center'} space={2} mb={4}>
              <AppIcon iconName={'male-female-outline'} />
              <Text>{gender}</Text>
            </HStack>
          </Stack>
          <Stack>
            <Text color={'muted.500'} mb={1} fontSize={12}>
              Age
            </Text>
            <HStack alignItems={'center'} space={2}>
              <AppIcon iconName={'today-outline'} />
              <Text>{dobToAgeFormatter(birthday)}</Text>
            </HStack>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  )
}
