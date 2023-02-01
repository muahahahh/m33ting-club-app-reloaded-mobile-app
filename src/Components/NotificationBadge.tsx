import { Box, Text } from 'native-base'
import React from 'react'

export type NotificationBadgeProps = { badge: string }

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  badge,
}) => {
  return (
    <Box
      bg={'#EB4D3D'}
      h={6}
      w={6}
      borderRadius={12}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Text color={'white'}>{badge}</Text>
    </Box>
  )
}
