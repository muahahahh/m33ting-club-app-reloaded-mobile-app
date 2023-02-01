import React from 'react'
import { Flex, Heading } from 'native-base'

type NothingToShowHereProps = {
  text: string
}

const NothingToShowHere: React.FC<NothingToShowHereProps> = () => (
  <Flex justifyContent="center" alignItems={'center'} height={'100%'}>
    <Heading color="primary.500" fontSize="md">
      Nothing to show here yet
    </Heading>
  </Flex>
)

export default NothingToShowHere
