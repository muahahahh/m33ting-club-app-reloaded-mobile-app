import React, { useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { useDispatch } from 'react-redux'
import { loadingIndicatorSlice } from '@/Store/LoadingIndicator'
import {
  Flex,
  Button,
  Text,
  Box,
  Input,
  FormControl,
  Stack,
  Pressable,
  Progress,
  Heading,
  KeyboardAvoidingView,
  Link,
} from 'native-base'
import { useToast } from 'native-base'
import { Platform } from 'react-native'
import { Config } from '@/Config'

const PHONE_REGEX = /^\+[1-9]{0,3}[0-9]{0,12}$/

const SignInContainer = () => {
  const dispatch = useDispatch()
  const toast = useToast()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null)
  const [code, setCode] = useState('')

  const handlePhoneInput = async (phoneInput: string) => {
    if (!phoneInput || phoneInput.match(PHONE_REGEX)) {
      setPhoneNumber(phoneInput)
    }
  }

  async function signInWithPhoneNumber() {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
      toast.show({
        description: 'Send SMS to you',
      })
      setConfirm(confirmation)
    } catch (e) {
      console.log(e)
      toast.show({
        description: `Error: ${e}`,
      })
    }
  }

  async function confirmCode() {
    if (confirm) {
      try {
        await confirm.confirm(code)
        toast.closeAll()
        dispatch(loadingIndicatorSlice.actions.setLoading())
      } catch (error) {
        toast.show({
          description: 'Wrong SMS code',
        })
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'white'}
      flex={1}
    >
      <Flex w={'100%'} alignItems={'center'} p={'4'}>
        <Box alignItems={'center'} mb={'12'}>
          <Heading fontSize={'4xl'} mb={'2'}>
            M33TING.CLUB
          </Heading>
          <Text fontSize={'lg'}>Welcome! Please sign in.</Text>
        </Box>
        <Box w="100%" mb="10">
          <Progress value={confirm ? 95 : 45} />
        </Box>
        <FormControl>
          {!confirm ? (
            <>
              <FormControl.Label>Your phone number</FormControl.Label>
              <Input
                mb="5"
                placeholder="+48 500 100 200"
                w="100%"
                onChangeText={handlePhoneInput}
                value={phoneNumber}
                onFocus={() => {
                  if (!phoneNumber) {
                    setPhoneNumber('+48')
                  }
                }}
              />

              <Flex
                mb={5}
                flexDirection={'row'}
                width={'100%'}
                flexWrap={'wrap'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Text>By signing up or logging in you agree to our </Text>

                <Link href={Config.TERMS_AND_CONDITIONS_URI} fontSize={'sm'}>
                  Terms and Conditions
                </Link>
              </Flex>

              <Button onPress={signInWithPhoneNumber}>
                Send verification code
              </Button>
            </>
          ) : (
            <>
              <Stack mb={7}>
                <FormControl.Label>SMS Code</FormControl.Label>
                <Input
                  placeholder="123456"
                  onChangeText={setCode}
                  value={code}
                  isDisabled={!confirm}
                />
                <Pressable
                  onPress={() => {
                    setCode('')
                    setConfirm(null)
                  }}
                >
                  <FormControl.HelperText>
                    Didn't received sms? Send again.
                  </FormControl.HelperText>
                </Pressable>
              </Stack>
              <Button
                backgroundColor={code ? 'success.400' : 'info.600'}
                onPress={confirmCode}
              >
                Sign in
              </Button>
            </>
          )}
        </FormControl>
      </Flex>
    </KeyboardAvoidingView>
  )
}

export default SignInContainer
