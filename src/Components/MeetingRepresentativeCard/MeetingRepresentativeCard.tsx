import React from 'react'
import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  Stack,
  Text,
  VStack,
} from 'native-base'
import { DateTime } from 'luxon'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { GetMeetingsSingleMeetingAPIResponse } from '@/Services/modules/meetings'
import { Config } from '@/Config'
import MeetingTagBadge from '@/Components/MeetingTagBadge'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import {
  dateTimeFormatPattern,
  fallbackImageUri,
} from '@/Services/consts/consts'

export interface MeetingRepresentativeCardProps {
  meeting: GetMeetingsSingleMeetingAPIResponse
  cardHeight: number
}

export const MeetingRepresentativeCard: React.FC<
  MeetingRepresentativeCardProps
> = ({ meeting }) => {
  const imageSource = `${Config.S3_BACKGROUND_BUCKET_URl}/${meeting.imageId}-big.jpg`

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.300"
      borderWidth="1"
      mx={3}
      my={3}
    >
      <Pressable
        onPress={() =>
          navigate(MainNavigationRoutes.MEETING_DETAILS_VIEW, {
            meetingId: meeting.id,
          })
        }
      >
        <Box flex={1}>
          <Stack height={'100%'} direction={'column-reverse'}>
            <Stack space={2} px={3} py={2} borderTopRadius={'sm'}>
              <Heading
                size="xl"
                ml="-1"
                color={'black'}
                onPress={() =>
                  navigate(MainNavigationRoutes.MEETING_DETAILS_VIEW, {
                    meetingId: meeting.id,
                  })
                }
              >
                {meeting.name}
              </Heading>
              <VStack space={1}>
                <HStack space={2} alignItems={'center'}>
                  <AppIcon iconName={'calendar'} size={26} />
                  <Text>
                    {DateTime.fromISO(meeting.startDate).toFormat(
                      dateTimeFormatPattern,
                    )}
                  </Text>
                </HStack>
                <HStack space={2} alignItems={'center'}>
                  <AppIcon iconName={'navigate-circle-outline'} size={26} />
                  <Text>{meeting.distance} km</Text>
                </HStack>
              </VStack>
              <Text fontSize="sm" color={'black'} height={'100px'}>
                {meeting.description}
              </Text>
            </Stack>
            <Box flex={1} bg={'white'} flexDirection={'row'}>
              <AspectRatio flex={1} bg={'black'} w={'100%'} ratio={3 / 2}>
                <Image
                  resizeMode={'cover'}
                  source={{ uri: imageSource }}
                  fallbackSource={{ uri: fallbackImageUri }}
                  alt={'alt'}
                />
              </AspectRatio>
              <HStack
                position={'absolute'}
                bottom={0}
                flexWrap={'wrap'}
                pb={2}
                px={1}
                width={'100%'}
              >
                <MeetingTagBadge
                  tagName={meeting.isPublic ? 'public' : 'private'}
                  key={-1}
                  fontWeight={'bold'}
                />
                {meeting.tags &&
                  meeting.tags.map((tag, tagIndex) => (
                    <MeetingTagBadge
                      tagName={tag}
                      key={tagIndex}
                      fontWeight={'400'}
                    />
                  ))}
              </HStack>
            </Box>
          </Stack>
        </Box>
      </Pressable>
    </Box>
  )
}
