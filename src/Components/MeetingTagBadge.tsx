import { Center, Text } from 'native-base'
import React from 'react'

type MeetingTagBadgeParams = {
  tagName: string
  fontWeight: string
}

const MeetingTagBadge: React.FC<MeetingTagBadgeParams> = ({
  tagName,
  fontWeight,
}) => {
  return (
    <Center
      backgroundColor={'muted.800'}
      m={1}
      py={1}
      px={3}
      borderRadius={'lg'}
    >
      <Text fontSize={'md'} color={'muted.50'} fontWeight={fontWeight}>
        #{tagName}
      </Text>
    </Center>
  )
}

export default MeetingTagBadge
