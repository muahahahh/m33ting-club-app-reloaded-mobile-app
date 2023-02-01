import { Box, HStack, Pressable, Text, VStack } from 'native-base'
import AvatarCustomized from '@/Components/AvatarCustomized'
import timeFormatter from '@/Services/utils/timeFormatter'
import React from 'react'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import userImageUri from '@/Services/utils/userImageUri'

type FeedPreviewParams = {
  userImageId: string
  userName: string
  meetingRole: string
  meetingId: string
  meetingName: string
  occuredOn: string
}

const FeedPreview: React.FC<FeedPreviewParams> = ({
  userImageId,
  userName,
  meetingRole,
  meetingId,
  meetingName,
  occuredOn,
}) => {
  return (
    <Pressable
      h={'100'}
      borderRadius={'xl'}
      borderColor={'coolGray.200'}
      borderWidth={'1px'}
      backgroundColor={'coolGray.100'}
      onPress={() => {
        navigate(MainNavigationRoutes.MEETING_DETAILS_VIEW, {
          meetingId: meetingId,
        })
      }}
    >
      <HStack space={2} height={'100%'}>
        <Box py={3} px={1}>
          <AvatarCustomized imageUri={userImageUri(userImageId)} size={'md'} />
        </Box>
        <VStack flex={3} py={2}>
          <HStack space={2} flex={1}>
            <Text fontWeight={'bold'} fontSize={'md'}>
              {userName}
            </Text>
            <Text flex={2} fontSize={'md'} textAlign={'right'} pr={2}>
              {timeFormatter(occuredOn)}
            </Text>
          </HStack>

          <Text flex={2} fontSize={'md'} pr={2}>
            {meetingRole === 'Owner' ? 'Created' : 'Joined'}{' '}
            <Text fontWeight={'semibold'}>{meetingName}</Text>
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  )
}

export default FeedPreview
