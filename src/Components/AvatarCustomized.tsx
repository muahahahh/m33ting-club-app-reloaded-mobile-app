import { Avatar } from 'native-base'
import React from 'react'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { InterfaceAvatarProps } from 'native-base/lib/typescript/components/composites/Avatar/types'

type AvatarCustomizedProps = {
  imageUri?: string
  key?: any
  size?: InterfaceAvatarProps['size']
}

const AvatarCustomized: React.FC<AvatarCustomizedProps> = ({
  imageUri,
  key,
  size = 'sm',
}) => {
  return (
    <Avatar
      key={key}
      size={size}
      bg={'muted.400'}
      borderColor={'white:alpha.100'}
      borderWidth={0.5}
      source={{
        uri: imageUri,
      }}
    >
      <AppIcon
        iconName={'person'}
        size={(size && size === '2xl') || size === 'xl' ? 40 : 20}
        color={'#FFFFFF'}
      />
    </Avatar>
  )
}

export default AvatarCustomized
