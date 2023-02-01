/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  AspectRatio,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  TextArea,
  useToast,
} from 'native-base'
import { meetingsApi } from '@/Services/modules/meetings'
import { navigate } from '@/Navigators/utils'
import { MainNavigationRoutes } from '@/Navigators/MainNavigation/mainNavigationRoutes'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { Location } from '@/Store/ClientData'
import { useSelector } from 'react-redux'
import { userLocationSelector } from '@/Store/ClientData/clientDataSelectors'
import { DateTime } from 'luxon'
import { dateTimeFormatPattern } from '@/Services/consts/consts'
import { PickedTag, TagCloud } from '@/Components/TagCloud/TagCloud'
import { TouchableOpacity } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import * as mime from 'mime'
import { postMeetingBackground } from '@/Services/modules/meetings/postMeetingBackground'
import { authSelector } from '@/Store/Auth/authSelector'
import SpinnerModal from '@/Components/SpinnerModal'
import { BottomTabsNavigationRoutes } from '@/Navigators/BottomTabsNavigation/bottomTabsNavigationRoutes'
import { MeetingsOwnNavigationRoutes } from '@/Navigators/MeetingsOwnNavigation/meetingsOwnNavigationRoutes'
import { MeetingRolesEnum } from '@/Services/enums/meetings/MeetingRolesEnum'
import backgroundImageBigUri from '@/Services/utils/backgroundImageBigUri'
import { Meeting } from '@/Services/modules/meetings/fetchMeeting'
import { useRoute } from '@react-navigation/native'
import { EditMeetingRequest } from '@/Services/modules/meetings/mutationEditMeeting'
import { AddMeetingRequest } from '@/Services/modules/meetings/mutationAddMeeting'
import { FormActionsEnum } from '@/Components/MeetingForm/FormActionsEnum'
import { MeetingStatusesEnum } from '@/Services/enums/meetings/MeetingStatusesEnum'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

type AddMeetingForm = {
  name: string
  description: string
  confidentialInfo: string
  participantsLimit: string
  startDate: Date
  endDate: Date
  locationName: string
  locationDescription: string
  isPublic: boolean
  imageId: string
}

export type MeetingFormProps = {
  action: FormActionsEnum
  meetingLocation?: Location
  meetingTags?: PickedTag[]
  meetingData?: Meeting
}

export const MeetingForm: React.FC<MeetingFormProps> = props => {
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
  } = useForm<AddMeetingForm>({
    defaultValues: {
      name: '',
      description: '',
      participantsLimit: '',
      isPublic: false,
    },
  })

  const clientDataUserLocation = useSelector(userLocationSelector)
  const authState = useSelector(authSelector)

  const toast = useToast()
  const route = useRoute()

  const [addMutation, addMutationResult] =
    meetingsApi.useAddMeetingMutationMutation()

  const [editMutation, editMutationResult] =
    meetingsApi.useEditMeetingMutationMutation()

  const [datesError, setDatesError] = useState<string | undefined>(undefined)
  const [meetingTagsError, setMeetingTagsError] = useState<string | undefined>(
    undefined,
  )
  const [meetingLocationError, setMeetingLocationError] = useState<
    string | undefined
  >(undefined)

  const [meetingLocation, setMeetingLocation] = useState<Location | undefined>()

  const [startDate, setStartDate] = useState(
    DateTime.local().set({ hour: 18, minute: 0 }).plus({ day: 1 }).toJSDate(),
  )
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)

  const [endDate, setEndDate] = useState(
    DateTime.local().set({ hour: 20, minute: 0 }).plus({ day: 1 }).toJSDate(),
  )
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  const [meetingTags, setMeetingsTags] = useState<PickedTag[]>([])

  const [imageUri, setImageUri] = useState<string | undefined>(undefined)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const removeTag = (tagToRemove: string) => {
    setMeetingsTags(prevState => [
      ...prevState.filter(tag => tag.name !== tagToRemove),
    ])
  }

  useEffect(() => {
    if (props?.meetingData) {
      if (!props?.meetingLocation) {
        setMeetingLocation({
          coords: {
            latitude: props.meetingData.latitude,
            longitude: props.meetingData.longitude,
          },
          name: props.meetingData.locationDescription,
        })
      }

      setStartDate(DateTime.fromISO(props.meetingData.startDate).toJSDate())
      setEndDate(DateTime.fromISO(props.meetingData.endDate).toJSDate())

      setImageUri(backgroundImageBigUri(props.meetingData.imageId))
      setValue('imageId', props.meetingData.imageId)
      setValue('name', props.meetingData.name)
      setValue('description', props.meetingData.description)
      setValue('confidentialInfo', props.meetingData.confidentialInfo)
      setValue(
        'participantsLimit',
        props.meetingData.participantsLimit
          ? props.meetingData.participantsLimit.toString()
          : '',
      )
      let isPublicMeeting = props.meetingData
        ? props.meetingData.isPublic
        : false
      setValue('isPublic', isPublicMeeting)
    }
  }, [props.meetingData?.id])

  useEffect(() => {
    if (props?.meetingLocation) {
      setMeetingLocation(props.meetingLocation)
    }
    if (props?.meetingTags) {
      setMeetingsTags(props.meetingTags)
    }
  }, [props?.meetingLocation, props?.meetingTags])

  useEffect(() => {
    validateUncontrolledFields(true)
  }, [meetingTags, meetingLocation, startDate, endDate])

  useEffect(() => {
    if (addMutationResult.isSuccess) {
      toast.show({
        description: 'Congratulations! Meeting has been published!',
      })
      navigate(BottomTabsNavigationRoutes.YOUR_MEETINGS, {
        screen: MeetingsOwnNavigationRoutes.HOSTED,
        params: { meetingRole: MeetingRolesEnum.HOSTED },
      })
    }
    if (addMutationResult.isError) {
      toast.show({
        description: "Oops! We couldn't add your meeting, please try again",
      })
    }
  }, [addMutationResult])

  useEffect(() => {
    if (editMutationResult.isSuccess) {
      toast.show({
        description: 'Congratulations! Meeting has been published!',
      })
      navigate(BottomTabsNavigationRoutes.YOUR_MEETINGS, {
        screen: MeetingsOwnNavigationRoutes.HOSTED,
        params: { meetingRole: MeetingRolesEnum.HOSTED },
      })
    }
    if (editMutationResult.isError) {
      toast.show({
        description: "Oops! We couldn't edit your meeting, please try again",
      })
    }
  }, [editMutationResult])

  const validateUncontrolledFields = (onlyClear = false): boolean => {
    let isOk = true

    if (meetingTags.filter(tag => tag.isOfficial).length === 0) {
      if (!onlyClear) {
        setMeetingTagsError('You have to add at least one official tag')
      }
      isOk = false
    } else {
      setMeetingTagsError(undefined)
    }

    if (!meetingLocation) {
      if (!onlyClear) {
        setMeetingLocationError('You have to pick meeting location')
      }
      isOk = false
    } else {
      setMeetingLocationError(undefined)
    }

    if (DateTime.fromJSDate(startDate) >= DateTime.fromJSDate(endDate)) {
      if (!onlyClear) {
        setDatesError('End date must be later than start date')
      }
      isOk = false
    } else {
      setDatesError(undefined)
    }

    return isOk
  }

  const onSubmitAdd: SubmitHandler<AddMeetingForm> = async (
    form: AddMeetingForm,
  ) => {
    if (validateUncontrolledFields() && meetingLocation) {
      const meetingRequestBody: AddMeetingRequest = {
        name: form.name,
        description: form.description,
        confidentialInfo: form.confidentialInfo,
        participantsLimit: form.participantsLimit
          ? parseInt(form.participantsLimit, 10)
          : null,
        startDate: DateTime.fromJSDate(startDate).toUTC().toISO(),
        endDate: DateTime.fromJSDate(endDate).toUTC().toISO(),
        imageId: form.imageId,
        locationName: meetingLocation.name,
        locationDescription: meetingLocation.name,
        latitude: meetingLocation.coords.latitude,
        longitude: meetingLocation.coords.longitude,
        tags: meetingTags.map(tag => tag.name),
        isPublic: form.isPublic,
      }
      console.log(meetingRequestBody)

      await addMutation(meetingRequestBody)
    } else {
      console.log('Meeting Form validation error')
      toast.show({ description: 'Oops! You have to fix some fields' })
    }
  }

  const onSubmitEdit: SubmitHandler<AddMeetingForm> = async (
    form: AddMeetingForm,
  ) => {
    if (validateUncontrolledFields() && meetingLocation) {
      if (props.meetingData) {
        const meetingRequestBody: EditMeetingRequest = {
          id: props.meetingData.id,
          name: form.name,
          description: form.description,
          confidentialInfo: form.confidentialInfo,
          participantsLimit: form.participantsLimit
            ? parseInt(form.participantsLimit, 10)
            : null,
          startDate: DateTime.fromJSDate(startDate).toUTC().toISO(),
          endDate: DateTime.fromJSDate(endDate).toUTC().toISO(),
          imageId: form.imageId,
          locationName: meetingLocation.name,
          locationDescription: meetingLocation.name,
          latitude: meetingLocation.coords.latitude,
          longitude: meetingLocation.coords.longitude,
          tags: meetingTags.map(tag => tag.name),
          isPublic: form.isPublic,
        } as EditMeetingRequest

        console.log(meetingRequestBody)

        await editMutation(meetingRequestBody)
      }
    } else {
      console.log('Meeting Form validation error')
      toast.show({ description: 'Oops! You have to fix some fields' })
    }
  }

  const renderImagePicker = () => {
    if (!imageUri) {
      return <FormControl.HelperText>Tap to pick image</FormControl.HelperText>
    }

    return (
      <AspectRatio flex={1} ratio={1}>
        <Image
          resizeMode={'cover'}
          source={{
            uri: getValues('imageId')
              ? backgroundImageBigUri(getValues('imageId'))
              : imageUri,
          }}
          alt={'Your meeting image'}
        />
      </AspectRatio>
    )
  }

  const pickPicture = async () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
    }).then(async image => {
      console.log('picked image', image)
      setImageUri(image.path)

      const imagePath = image.path

      if (imagePath) {
        setIsImageLoading(true)
        const formData = new FormData()

        const mimeType: string | null = mime.getType(imagePath)

        formData.append('file', {
          uri: imagePath,
          name: 'background',
          type: mimeType,
        })

        try {
          let apiResponse = await postMeetingBackground(
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
        setIsImageLoading(false)
      }
    })
  }

  return (
    <Flex flex={1} w={'100%'} p={'4'}>
      <SpinnerModal
        isOpen={addMutationResult.isLoading || editMutationResult.isLoading}
      />
      <Flex flex={1}>
        <Heading size={'md'}>About your meeting</Heading>
        <FormControl isRequired isInvalid={!!errors.name}>
          <Stack my={2}>
            <FormControl.Label>Meeting title</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true, maxLength: 50 }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={'Photo session in park'}
                />
              )}
              name="name"
            />
            <FormControl.ErrorMessage>
              {errors.name?.type === 'required' && 'This field is required'}
              {errors.name?.type === 'maxLength' &&
                'This field must be shorter than 50 characters'}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.description}>
          <Stack my={2}>
            <FormControl.Label>Description</FormControl.Label>
            <Controller
              control={control}
              rules={{
                required: true,
                maxLength: 500,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCompleteType={undefined}
                />
              )}
              name="description"
            />
            <FormControl.ErrorMessage>
              {errors.name?.type === 'required' && 'This field is required'}
              {errors.name?.type === 'maxLength' &&
                'This field must be shorter than 500 characters'}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>

        <FormControl isInvalid={!!errors.confidentialInfo}>
          <Stack my={2}>
            <FormControl.Label>Confidential info</FormControl.Label>

            <Controller
              control={control}
              rules={{
                required: false,
                maxLength: 500,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCompleteType={undefined}
                />
              )}
              name="confidentialInfo"
            />
            <FormControl.ErrorMessage>
              {errors.name?.type === 'maxLength' &&
                'This field must be shorter than 500 characters'}
            </FormControl.ErrorMessage>
            <FormControl.HelperText>
              Here you can put additional useful information and links, which
              will be visible only to users, who have joined the meeting
            </FormControl.HelperText>
          </Stack>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.imageId}>
          <Stack>
            <FormControl.Label>Meeting background</FormControl.Label>
            <Controller
              control={control}
              rules={{ required: true }}
              render={() => (
                <TouchableOpacity onPress={() => pickPicture()}>
                  <Flex
                    mb={4}
                    p={2}
                    w={'100%'}
                    h={'200px'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    borderWidth={'1px'}
                    borderColor={'coolGray.300'}
                    borderRadius={'lg'}
                  >
                    {renderImagePicker()}
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
                      </Flex>
                    )}
                  </Flex>
                </TouchableOpacity>
              )}
              name={'imageId'}
            />
            <FormControl.ErrorMessage>
              Image is required
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>

        <FormControl isRequired={true} isInvalid={!!meetingTagsError}>
          <Stack my={3}>
            <FormControl.Label>Meeting tags</FormControl.Label>
            <HStack alignItems={'center'} space={3}>
              <Box flexGrow={1}>
                <Input
                  placeholder={'Sport ...'}
                  onFocus={() =>
                    navigate<MainNavigationRoutes.SEARCH_TAGS>(
                      MainNavigationRoutes.SEARCH_TAGS,
                      {
                        redirectTo: route.name as MainNavigationRoutes,
                        initTags: meetingTags,
                        acceptNewTags: true,
                      },
                    )
                  }
                />
              </Box>
            </HStack>
            <Flex flexDirection={'row'} flexWrap={'wrap'} mt={3}>
              {meetingTags.map((item, index) => {
                return (
                  <TagCloud
                    tag={item}
                    onPress={() => removeTag(item.name)}
                    key={index}
                  />
                )
              })}
            </Flex>
            <FormControl.HelperText>
              <HStack alignItems={'center'}>
                <Text color={'muted.500'} fontSize={12}>
                  At least one official{' '}
                </Text>
                <AppIcon iconName={'star-outline'} size={12} />
                <Text color={'muted.500'} fontSize={12}>
                  {' '}
                  tag
                </Text>
              </HStack>
            </FormControl.HelperText>
            <FormControl.ErrorMessage>
              {meetingTagsError}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
      </Flex>

      <Box w={'100%'} bg={'coolGray.200'} h={'2px'} borderRadius={'lg'} />

      <Flex my={6}>
        <Heading size={'md'}>Where? When?</Heading>
        <FormControl isRequired isInvalid={!!meetingLocationError}>
          <Stack my={3}>
            <FormControl.Label>Meeting location</FormControl.Label>
            <HStack alignItems={'center'} space={3}>
              <Box flexGrow={1}>
                <Input
                  borderRadius={'lg'}
                  p={3}
                  bgColor={'light.100'}
                  borderColor={'light.400'}
                  borderWidth={1}
                  value={meetingLocation?.name || ''}
                  fontSize={'sm'}
                  onFocus={() =>
                    navigate<MainNavigationRoutes.PICK_USER_LOCATION>(
                      MainNavigationRoutes.PICK_USER_LOCATION,
                      {
                        redirectTo: route.name as MainNavigationRoutes,
                        initCoords: clientDataUserLocation.coords,
                      },
                    )
                  }
                />
              </Box>
              <Button
                onPress={() =>
                  navigate<MainNavigationRoutes.PICK_USER_LOCATION>(
                    MainNavigationRoutes.PICK_USER_LOCATION,
                    {
                      redirectTo: route.name as MainNavigationRoutes,
                      initCoords: clientDataUserLocation.coords,
                    },
                  )
                }
              >
                <HStack alignItems={'center'} space={2} px={2}>
                  <Text color={'white'}>Pick location</Text>
                  <AppIcon iconName={'locate'} color={'#FFFFFF'} />
                </HStack>
              </Button>
            </HStack>
            <FormControl.ErrorMessage>
              {meetingLocationError}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>

        <FormControl isRequired>
          <Stack my={3}>
            <FormControl.Label>Meeting start date</FormControl.Label>
            <Button onPress={() => setIsStartDateOpen(true)}>
              {DateTime.fromJSDate(startDate).toFormat(dateTimeFormatPattern)}
            </Button>
            <DateTimePickerModal
              mode={'datetime'}
              isVisible={isStartDateOpen}
              date={startDate}
              onConfirm={date => {
                setIsStartDateOpen(false)
                setStartDate(date)
                setEndDate(date)
              }}
              onCancel={() => {
                setIsStartDateOpen(false)
              }}
            />
          </Stack>
        </FormControl>

        <FormControl isRequired isInvalid={!!datesError}>
          <Stack my={3}>
            <FormControl.Label>Meeting end date</FormControl.Label>
            <Button onPress={() => setIsEndDateOpen(true)}>
              {DateTime.fromJSDate(endDate).toFormat(dateTimeFormatPattern)}
            </Button>
            <DateTimePickerModal
              mode={'datetime'}
              isVisible={isEndDateOpen}
              date={endDate}
              onConfirm={date => {
                setIsEndDateOpen(false)
                setEndDate(date)
              }}
              onCancel={() => {
                setIsEndDateOpen(false)
              }}
            />
            <FormControl.ErrorMessage>{datesError}</FormControl.ErrorMessage>
          </Stack>
        </FormControl>
      </Flex>

      <Box w={'100%'} bg={'coolGray.200'} h={'2px'} borderRadius={'lg'} />

      <Flex my={6}>
        <Heading size={'md'}>Meeting settings</Heading>
        <FormControl isInvalid={!!errors.participantsLimit}>
          <Stack my={2}>
            <FormControl.Label>Participants limit</FormControl.Label>
            <Controller
              control={control}
              rules={{ min: 2, max: 1000 }}
              render={({ field: { onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={inputValue => {
                    if (!inputValue || inputValue.match(/^\d+$/)) {
                      setValue('participantsLimit', inputValue)
                    }
                  }}
                  value={value}
                  keyboardType={'numeric'}
                />
              )}
              name="participantsLimit"
            />
            <FormControl.HelperText>
              Leave empty if you don't want any limits
            </FormControl.HelperText>
            <FormControl.ErrorMessage>
              It must be greater than 2 and less than 1000
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>

        <FormControl>
          <Stack my={2}>
            <HStack space={2} alignItems="center">
              <FormControl.Label>My meeting is public</FormControl.Label>
              <Controller
                control={control}
                render={() => (
                  <Checkbox
                    isChecked={getValues('isPublic')}
                    aria-label="Is public"
                    onChange={value => {
                      setValue('isPublic', value)
                    }}
                    value={'isPublic'}
                  />
                )}
                name="isPublic"
              />
            </HStack>
            <FormControl.HelperText>
              Mark it if you want to automatically accept any guest
            </FormControl.HelperText>
          </Stack>
        </FormControl>
      </Flex>

      <Stack>
        <Button
          disabled={props.meetingData?.status === MeetingStatusesEnum.CANCELLED}
          backgroundColor={
            props.meetingData?.status === MeetingStatusesEnum.CANCELLED
              ? 'muted.400'
              : 'primary.600'
          }
          onPress={handleSubmit(
            props.action === FormActionsEnum.ADD ? onSubmitAdd : onSubmitEdit,
            () => {
              toast.show({ description: 'Oops! You have to fix some fields' })
              validateUncontrolledFields()
            },
          )}
        >
          {props.meetingData?.status === MeetingStatusesEnum.CANCELLED
            ? 'You cannot edit cancelled meeting'
            : `${props.action} meeting`}
        </Button>
      </Stack>
    </Flex>
  )
}
