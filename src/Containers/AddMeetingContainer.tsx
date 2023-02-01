import { Box, KeyboardAvoidingView, ScrollView } from 'native-base'
import React from 'react'

import { goBack } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { MainNavigationParamList } from '@/Navigators/MainNavigation/MainNavigation'
import { StackScreenProps } from '@react-navigation/stack'
import { Platform } from 'react-native'
import { MeetingForm } from '@/Components/MeetingForm/MeetingForm'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { FormActionsEnum } from '@/Components/MeetingForm/FormActionsEnum'

type AddMeetingContainerProps = StackScreenProps<
  MainNavigationParamList,
  MainNavigationRoutes.ADD_MEETING
>

const AddMeetingContainer: React.FC<AddMeetingContainerProps> = ({
  route: { params },
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      alignItems={'center'}
      backgroundColor={'white'}
      flex={1}
    >
      <ScreenTopHeader title={'New meeting'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <ScrollView w={'100%'}>
        <MeetingForm
          action={FormActionsEnum.ADD}
          meetingLocation={params.location}
          meetingTags={params.pickedTags}
        />
        <Box pb={12} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AddMeetingContainer
