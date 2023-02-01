import React from 'react'
import {
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  VStack,
  Text,
} from 'native-base'
import { Config } from '@/Config'

const StartupContainer = () => {
  return (
    <Flex
      flex={1}
      alignItems={'center'}
      justifyContent={'center'}
      bgColor={'white'}
    >
      <Image
        source={require('@/Assets/Images/m33logo.png')}
        size={'2xl'}
        alt={'M33TING.CLUB Logo'}
      />
      <VStack alignItems={'center'}>
        <HStack space={3}>
          <Heading fontWeight={300} fontSize={16}>
            M33TING.CLUB
          </Heading>
          <Spinner />
        </HStack>
        <Text color={'muted.500'} mt={4}>
          env: {Config.APP_ENV.toLowerCase()}
        </Text>
      </VStack>
    </Flex>
  )
}

export default StartupContainer
