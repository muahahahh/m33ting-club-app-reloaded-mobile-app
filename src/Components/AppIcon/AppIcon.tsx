import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '@/Theme/Variables'
import { StyleProp } from 'react-native'

export type AppIconProps = {
  iconName: string
  highlight?: boolean
  disabled?: boolean
  size?: number
  onPress?: () => void
  color?: string
  style?: StyleProp<any>
}

export const AppIcon: React.FC<AppIconProps> = (
  { iconName = '', highlight, disabled, size = 27, onPress, color, style } = {
    size: 27,
    iconName: 'bulb-outline',
  },
) => {
  const [computedColor, setComputedColor] = useState(Colors.iconColor)

  useEffect(() => {
    if (highlight) {
      setComputedColor(Colors.activeColor)
    }

    if (disabled) {
      setComputedColor(Colors.disabledColor)
    }
  }, [disabled, highlight, setComputedColor])

  return (
    <Ionicons
      name={iconName}
      size={size}
      color={color || computedColor}
      {...(onPress ? { onPress: onPress } : {})}
      {...(style ? { style: style } : {})}
    />
  )
}
