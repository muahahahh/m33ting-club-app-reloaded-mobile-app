import { Avatar, Heading, VStack } from 'native-base'
import React from 'react'
import { Participant } from '@/Services/modules/meetings/fetchMeeting'
import AvatarCustomized from '@/Components/AvatarCustomized'
import userImageUri from '@/Services/utils/userImageUri'

type UserPreviewProps = {
  title: string
  participants: Array<Participant>
}

const UserPreview: React.FC<UserPreviewProps> = ({ title, participants }) => {
  const AVATARS_SHOWN = 12

  const shownParticipants = participants.slice(0, AVATARS_SHOWN)

  return (
    <VStack flex={1} pl={2}>
      <Heading size="sm" color={'black'} pb={2}>
        {title}
      </Heading>

      <Avatar.Group mr={'auto'} max={AVATARS_SHOWN}>
        {shownParticipants.map((object, i) => {
          return (
            <AvatarCustomized key={i} imageUri={userImageUri(object.imageId)} />
          )
        })}
      </Avatar.Group>
    </VStack>
  )
}

export default UserPreview
