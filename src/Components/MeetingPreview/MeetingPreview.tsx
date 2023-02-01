import { Box, Flex, HStack, Text } from 'native-base'
import React from 'react'
import { DateTime } from 'luxon'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { dateTimeFormatPattern } from '@/Services/consts/consts'

type PreviewProps = {
  id: string
  name: string
  startDate: string
  imageUri: string
  notificationsCount: number
}

const MeetingPreview: React.FC<PreviewProps> = ({
  id,
  name,
  startDate,
  imageUri,
  notificationsCount,
}) => {
  const dateFormatted = DateTime.fromISO(startDate).toFormat(
    dateTimeFormatPattern,
  )

  return (
    <Flex position={'relative'} overflow={'hidden'} borderRadius={'lg'}>
      <TouchableOpacity
        onPress={() => {
          navigate(MainNavigationRoutes.MEETING_DETAILS_VIEW, {
            meetingId: id,
          })
        }}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{
            uri: imageUri,
          }}
          style={{ aspectRatio: 780 / 190, width: '100%' }}
          blurRadius={15}
        >
          <Flex height={'100%'} width={'100%'}>
            <Flex
              py={2}
              px={2}
              width={'100%'}
              bg={{
                linearGradient: {
                  colors: ['dark.50', 'rgba(24, 24, 27, 0)'],
                  start: [0, 0],
                  end: [0, 1],
                },
              }}
            >
              <HStack direction={'row'} space={2} h={'100%'}>
                <Box
                  h={'100%'}
                  flexDirection={'column'}
                  justifyContent={'space-between'}
                >
                  <Text
                    alignSelf={'flex-start'}
                    alignItems={'center'}
                    fontSize={'md'}
                    fontWeight={'bold'}
                    color={'muted.100'}
                    position={'relative'}
                  >
                    {name}
                  </Text>
                  {notificationsCount > 0 && (
                    <Box
                      bg={'#EB4D3D'}
                      borderRadius={120}
                      alignSelf={'flex-start'}
                      px={2}
                    >
                      <Text color={'white'}>
                        {notificationsCount}{' '}
                        {notificationsCount === 1
                          ? 'notification'
                          : 'notifications'}
                      </Text>
                    </Box>
                  )}
                </Box>
                <Box flex={1} mx={2}>
                  <Text
                    alignSelf={'flex-end'}
                    alignItems={'center'}
                    fontSize={'sm'}
                    textAlign={'right'}
                    color={'muted.100'}
                    position={'relative'}
                  >
                    {dateFormatted}
                  </Text>
                </Box>
              </HStack>
            </Flex>
          </Flex>
        </ImageBackground>
      </TouchableOpacity>
    </Flex>
  )
}

export default MeetingPreview
