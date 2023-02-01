import React from 'react'
import { Box } from 'native-base'
import { FontSize } from '@/Theme/Variables'

type FilterCloudProps = {
  text: string
  onClick: () => void
  selectState: boolean
  width?: number
  flex: number
}

const FilterCloud: React.FC<FilterCloudProps> = ({
  text,
  onClick,
  selectState,
  width,
  flex,
}) => {
  return (
    <Box
      backgroundColor={selectState ? 'primary.100' : 'primary.50'}
      borderRadius={'3xl'}
      borderColor={'primary.500'}
      borderWidth={1}
      alignItems={'center'}
      justifyContent={'center'}
      padding={1}
      marginX={0.5}
      fontSize={FontSize.small}
      width={width}
      onTouchStart={() => {
        if (!selectState) {
          onClick()
        }
      }}
      flex={flex}
    >
      {text}
    </Box>
  )
}

export default FilterCloud
