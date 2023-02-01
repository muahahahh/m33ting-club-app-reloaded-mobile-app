import React, { ReactElement } from 'react'
import { Heading, HStack } from 'native-base'

export type ScreenTopHeaderProps = {
  children?: ReactElement | ReactElement[]
  title: string
  zIndex?: number
}

export const ScreenTopHeader: React.FC<ScreenTopHeaderProps> = ({
  children,
  title,
  zIndex = 1,
}) => {
  return (
    <HStack
      w={'100%'}
      h={'60px'}
      borderColor="coolGray.200"
      borderWidth="1"
      bg={'white'}
      px={5}
      justifyContent={'space-between'}
      alignItems={'center'}
      zIndex={zIndex}
    >
      <Heading>{title}</Heading>
      <HStack>{children}</HStack>
    </HStack>
  )
}
