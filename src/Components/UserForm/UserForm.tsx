import {
  Box,
  Button,
  CheckIcon,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  Spinner,
  Stack,
  useToast,
  VStack,
  WarningOutlineIcon,
} from 'native-base'
import { DateTime } from 'luxon'
import { dateTimeWithYearFormatPattern } from '@/Services/consts/consts'
import { TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import AvatarCustomized from '@/Components/AvatarCustomized'
import ImagePicker from 'react-native-image-crop-picker'
import { loadingIndicatorSlice } from '@/Store/LoadingIndicator'
import auth from '@react-native-firebase/auth'
import { authSlice } from '@/Store/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '@/Store/Auth/authSelector'
import {
  useLazyFetchUsersMeQuery,
  useUsersFinishSignUpMutation,
} from '@/Services/modules/users'
import { postUserAvatar } from '@/Services/modules/users/postUserAvatar'
import * as mime from 'mime'
import userImageUri from '@/Services/utils/userImageUri'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

export type UserFormType = {
  name: string
  gender: string
  imageId: string
}

export const UserForm = () => {
  const dispatch = useDispatch()
  const authState = useSelector(authSelector)

  const [finishSignUp] = useUsersFinishSignUpMutation()
  const [fetchUsersMe] = useLazyFetchUsersMeQuery()

  const toast = useToast()

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
  } = useForm<UserFormType>({
    defaultValues: {
      name: '',
      gender: '',
      imageId: '',
    },
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [birthDayDate, setBirthDayDate] = useState(DateTime.local().toJSDate())

  const [imageUri, setImageUri] = useState<string | undefined>(undefined)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const renderImagePicker = () => {
    return (
      <AvatarCustomized
        size={'2xl'}
        imageUri={
          getValues('imageId') ? userImageUri(getValues('imageId')) : imageUri
        }
      />
    )
  }

  const pickPicture = async () => {
    ImagePicker.openPicker({
      width: 780,
      height: 780,
      cropping: true,
    }).then(async image => {
      setImageUri(image.path)

      const imagePath = image.path

      if (imagePath) {
        setIsImageLoading(true)
        const formData = new FormData()

        const mimeType: string | null = mime.getType(imagePath)

        formData.append('file', {
          uri: imagePath,
          name: 'avatar',
          type: mimeType,
        })

        try {
          let apiResponse = await postUserAvatar(
            formData,
            authState.user?.token as string,
          )

          console.log(apiResponse.id)

          setValue('imageId', apiResponse.id)
          clearErrors('imageId')
        } catch (e) {
          toast.show({ description: 'Photo upload error, pick other picture' })
          console.log('Photo upload error')
          setImageUri(undefined)
        }
      }
      setIsImageLoading(false)
    })
  }

  const submitUser: SubmitHandler<UserFormType> = async form => {
    dispatch(loadingIndicatorSlice.actions.setLoading())
    await finishSignUp({
      name: form.name,
      gender: form.gender,
      birthday: DateTime.fromJSDate(birthDayDate).toUTC().toISO(),
      ...(form.imageId ? { imageId: form.imageId } : {}),
    })
    const user = auth().currentUser

    if (user) {
      const newToken = await user.getIdToken(true)
      dispatch(authSlice.actions.setUserToken({ token: newToken }))
      const userDetailsResult = await fetchUsersMe(undefined)
      dispatch(
        authSlice.actions.setUser({
          user: {
            token: newToken,
            userDetails: userDetailsResult.data,
          },
        }),
      )
      dispatch(loadingIndicatorSlice.actions.setLoaded())
    } else {
      throw new Error()
    }
  }

  return (
    <Box mx={'4'} my={8}>
      <Heading fontSize="2xl">Welcome in M33TING CLUB!</Heading>

      <FormControl isRequired isInvalid={!!errors.name}>
        <Stack my={2}>
          <FormControl.Label>What's your name?</FormControl.Label>
          <Controller
            control={control}
            rules={{ required: true, maxLength: 32, minLength: 3 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                type="text"
                defaultValue=""
                placeholder="Rick"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="name"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.name?.type === 'required' && 'This field is required'}
            {errors.name?.type === 'maxLength' &&
              'This field must be shorter than 32 characters'}
            {errors.name?.type === 'minLength' &&
              'This field must be longer than 3 characters'}
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.gender}>
        <Stack my={2}>
          <FormControl.Label>Tell us about your gender</FormControl.Label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Select
                selectedValue={value}
                minWidth="200"
                accessibilityLabel="Set your gender"
                placeholder="Choose"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => onChange(itemValue)}
              >
                <Select.Item label="Male" value="Male" />
                <Select.Item label="Female" value="Female" />
                <Select.Item label="Other" value="Other" />
              </Select>
            )}
            name="gender"
          />
        </Stack>
        <FormControl.ErrorMessage>
          {errors.name?.type === 'required' && 'This field is required'}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl isRequired={true}>
        <Box alignItems={'flex-start'} my={2}>
          <FormControl.Label>And put your birth date:</FormControl.Label>
          <Button onPress={() => setShowDatePicker(true)} px={8}>
            {DateTime.fromJSDate(birthDayDate).toFormat(
              dateTimeWithYearFormatPattern,
            )}
          </Button>
          <DateTimePickerModal
            mode={'date'}
            isVisible={showDatePicker}
            date={birthDayDate}
            onConfirm={date => {
              setShowDatePicker(false)
              setBirthDayDate(date)
            }}
            onCancel={() => {
              setShowDatePicker(false)
            }}
          />
        </Box>
      </FormControl>

      <FormControl>
        <Stack my={2}>
          <FormControl.Label>Your avatar</FormControl.Label>
          <TouchableOpacity onPress={() => pickPicture()}>
            <Flex
              mb={4}
              w={'100%'}
              h={'200px'}
              alignItems={'center'}
              justifyContent={'center'}
              borderWidth={'1px'}
              borderColor={'coolGray.300'}
              borderRadius={'lg'}
            >
              {renderImagePicker()}
              <FormControl.HelperText>Tap to change</FormControl.HelperText>
              {isImageLoading && (
                <Flex
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  borderRadius={'lg'}
                >
                  <Spinner size={'lg'} color={'muted.500'} />
                  <FormControl.HelperText opacity={0}>
                    Tap to change
                  </FormControl.HelperText>
                </Flex>
              )}
            </Flex>
          </TouchableOpacity>
        </Stack>
      </FormControl>

      <VStack space={4}>
        <Button onPress={handleSubmit(submitUser, () => console.log('inv'))}>
          Submit
        </Button>
        <Button
          onPress={() => {
            auth().signOut().then()
          }}
          variant={'outline'}
        >
          Sign Out
        </Button>
      </VStack>
    </Box>
  )
}
