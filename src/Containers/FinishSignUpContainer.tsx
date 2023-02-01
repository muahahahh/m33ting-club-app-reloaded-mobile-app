import React from 'react'

import { UserForm } from '@/Components/UserForm/UserForm'
import { KeyboardAvoidingView, ScrollView } from 'native-base'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { Platform } from 'react-native'

const FinishSignUpContainer = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      alignItems={'center'}
      backgroundColor={'white'}
      flex={1}
    >
      <ScreenTopHeader title={'Finish sign up'} />
      <ScrollView w={'100%'}>
        <UserForm />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default FinishSignUpContainer
