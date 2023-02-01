import { Participant } from '@/Services/modules/meetings/fetchMeeting'
import { Avatar, Flex, HStack, Pressable, Text, VStack } from 'native-base'
import userImageUri from '@/Services/utils/userImageUri'
import React from 'react'
import { FlatList } from 'react-native'
import { MeetingRolesEnum } from '@/Services/enums/meetings/MeetingRolesEnum'
import { RouteProp, useRoute } from '@react-navigation/native'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { goBack, navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'

type ParticipantsContainerProps = {
  participants: Array<Participant>
}

const ParticipantsContainer = () => {
  const route =
    useRoute<RouteProp<Record<string, ParticipantsContainerProps>, string>>()

  const order: string[] = [
    MeetingRolesEnum.HOSTED,
    MeetingRolesEnum.LEAD,
    MeetingRolesEnum.JOINED,
  ]

  const participantsCopy = route.params.participants.slice()

  function compareByArray(a: Participant, b: Participant) {
    if (order.indexOf(a.meetingRole) < order.indexOf(b.meetingRole)) {
      return -1
    }
    if (order.indexOf(a.meetingRole) > order.indexOf(b.meetingRole)) {
      return 1
    }
    return 0
  }

  let participantsSorted = participantsCopy.sort(compareByArray)

  return (
    <Flex flex={1}>
      <ScreenTopHeader title={'Participants'}>
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
          data={participantsSorted}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigate<MainNavigationRoutes.USER_PROFILE>(
                  MainNavigationRoutes.USER_PROFILE,
                  { userId: item.userId },
                )
              }
            >
              <HStack
                width={'100%'}
                space={10}
                py={2}
                alignItems={'flex-start'}
                mr={'auto'}
              >
                <Avatar
                  size={'md'}
                  bg={'muted.400'}
                  borderColor={'white:alpha.100'}
                  borderWidth={0.5}
                  source={{
                    uri: userImageUri(item.imageId),
                  }}
                >
                  <AppIcon iconName={'person'} size={30} color={'#FFFFFF'} />
                </Avatar>
                <VStack textAlign={'left'} alignItems={'flex-start'}>
                  <Text fontSize={'lg'} textAlign={'left'}>
                    {item.name}
                  </Text>
                  <Text fontSize={'sm'} textAlign={'left'}>
                    {item.meetingRole}
                  </Text>
                </VStack>
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

export default ParticipantsContainer
