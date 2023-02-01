import {
  Box,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  useToast,
} from 'native-base'
import React, { useEffect, useState } from 'react'

import { goBack } from '@/Navigators/utils'
import { Platform } from 'react-native'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Meeting } from '@/Services/modules/meetings/fetchMeeting'
import { PickedTag } from '@/Components/TagCloud/TagCloud'
import { tagsApi } from '@/Services/modules/tags'
import { MeetingForm } from '@/Components/MeetingForm/MeetingForm'
import { FormActionsEnum } from '@/Components/MeetingForm/FormActionsEnum'
import { Location } from '@/Store/ClientData'
import { meetingsApi, useFetchMeetingQuery } from '@/Services/modules/meetings'
import SpinnerModal from '@/Components/SpinnerModal'
import AlertConfimationDialog from '@/Components/AlertConfirmationDialog'
import { MeetingStatusesEnum } from '@/Services/enums/meetings/MeetingStatusesEnum'

type EditMeetingContainerParams = {
  meetingId: string
  location?: Location
  pickedTags?: PickedTag[]
}

const EditMeetingContainer = () => {
  const route =
    useRoute<RouteProp<Record<string, EditMeetingContainerParams>, string>>()

  const [meeting, setMeeting] = useState<Meeting>()

  const toast = useToast()

  const [pickedTags, setPickedTags] = useState<Array<PickedTag>>([])

  const [spinnerModalVisible, setSpinnerModalVisible] = useState(false)
  const [deleteConfirmationAlertVisible, setDeleteConfirmationAlertVisible] =
    useState(false)

  const [usedTags, setUsedTags] = useState<Array<PickedTag>>([])

  const fetchMeeting = useFetchMeetingQuery({ id: route.params.meetingId })
  const [cancelMeeting] = meetingsApi.useCancelMeetingMutationMutation()
  const cancelMeetingHandler = async (id: string) => {
    setSpinnerModalVisible(true)
    await cancelMeeting({ id: id })
    setSpinnerModalVisible(false)
  }

  const fetchTags = tagsApi.endpoints.getTags.useQuery(null)

  const { data } = fetchTags

  useEffect(() => {
    //TODO refactor this
    if (data && data.length) {
      let oldTags = data.filter(x => meeting?.tags.includes(x.name))
      let tgs = oldTags.map(x => ({ name: x.name, isOfficial: x.isOfficial }))
      setUsedTags(tgs)
      console.log(tgs)
    }
  }, [data, meeting?.tags, pickedTags])

  useEffect(() => {
    if (route.params.pickedTags) {
      setPickedTags(route.params.pickedTags)
    }
  }, [route.params.pickedTags])

  const meetingResponse = fetchMeeting
  useEffect(() => {
    if (meetingResponse.data) {
      setMeeting(meetingResponse.data)
    }
  }, [meetingResponse.data])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      alignItems={'center'}
      backgroundColor={'white'}
      flex={1}
    >
      <SpinnerModal isOpen={spinnerModalVisible} />
      <ScreenTopHeader title={'Edit meeting'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <ScrollView w={'100%'} pb={12}>
        <MeetingForm
          action={FormActionsEnum.EDIT}
          meetingData={meeting}
          meetingLocation={route.params.location}
          meetingTags={pickedTags?.length ? pickedTags : usedTags}
        />
        {meeting?.status !== MeetingStatusesEnum.CANCELLED ? (
          <Button
            mx={4}
            backgroundColor={'danger.600'}
            onPress={() => {
              setDeleteConfirmationAlertVisible(true)
            }}
          >
            Cancel meeting
          </Button>
        ) : (
          <Box />
        )}
        <AlertConfimationDialog
          textHeader={'Cancel meeting'}
          textQuestion={'Are you sure want to cancel meeting?'}
          textConfirm={'Yes'}
          textCancel={'No'}
          isOpen={deleteConfirmationAlertVisible}
          onConfirm={() => {
            if (meeting) {
              cancelMeetingHandler(meeting.id).then()
              setDeleteConfirmationAlertVisible(false)
            } else {
              toast.show({ description: 'Oops, something went wrong' })
            }
            setDeleteConfirmationAlertVisible(false)
          }}
          onCancel={() => setDeleteConfirmationAlertVisible(false)}
        />
        <Box pb={12} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditMeetingContainer
