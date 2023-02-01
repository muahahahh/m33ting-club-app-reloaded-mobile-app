import { TouchableOpacity } from 'react-native'
import { HStack, Text } from 'native-base'
import React from 'react'
import { AppIcon } from '@/Components/AppIcon/AppIcon'

export type PickedTag = {
  name: string
  isOfficial: boolean
}

export interface TagCloudProps {
  tag: PickedTag
  onPress: (tagName: string) => void
}

export const TagCloud: React.FC<TagCloudProps> = ({ tag, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(tag.name)}>
      <HStack
        backgroundColor={'primary.100'}
        borderRadius={20}
        borderColor={'primary.500'}
        borderWidth={1}
        alignItems={'center'}
        justifyContent={'center'}
        px={3}
        py={1}
        m={1}
        space={2}
      >
        <HStack alignItems={'center'} space={1}>
          <Text fontSize={'sm'}># {tag.name}</Text>
          {tag.isOfficial && <AppIcon iconName={'star-outline'} size={14} />}
        </HStack>
        <AppIcon iconName={'close-outline'} size={12} />
      </HStack>
    </TouchableOpacity>
  )
}
