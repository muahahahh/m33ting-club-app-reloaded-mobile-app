import React, { useState } from 'react'
import { Box, Button, Flex, useToast } from 'native-base'
import auth from '@react-native-firebase/auth'
import { ScreenTopHeader } from '@/Components/ScreenTopHeader/ScreenTopHeader'
import { AppIcon } from '@/Components/AppIcon/AppIcon'
import { goBack } from '@/Navigators/utils'
import { useSelector } from 'react-redux'
import { AuthState } from '@/Store/Auth'
import { UserDetails } from '@/Components/UserDetails/UserDetails'
import SpinnerModal from '@/Components/SpinnerModal'
import { userApi } from '@/Services/modules/users'
import AlertConfimationDialog from '@/Components/AlertConfirmationDialog'
import { QueryStatus } from '@reduxjs/toolkit/query'

export const YouContainer: React.FC = () => {
  const authState = useSelector((state: { auth: AuthState }) => state.auth)
  const user = useSelector((state: { auth: AuthState }) => state.auth.user)

  const toast = useToast()

  const [spinnerModalVisible, setSpinnerModalVisible] = useState(false)

  const [deleteConfirmationAlertVisible, setDeleteConfirmationAlertVisible] =
    useState(false)

  const [deleteUser, status] = userApi.useMutationDeleteMutation()
  const deleteUserHandler = async () => {
    setSpinnerModalVisible(true)
    await deleteUser(undefined)
    setSpinnerModalVisible(false)
  }

  return (
    <Flex flex={1} bgColor={'white'}>
      <SpinnerModal isOpen={spinnerModalVisible} />
      <ScreenTopHeader title={'You'}>
        <AppIcon
          iconName={'close-outline'}
          size={26}
          onPress={() => {
            goBack()
          }}
        />
      </ScreenTopHeader>
      <UserDetails
        id={authState.user?.userDetails?.id as string}
        name={authState.user?.userDetails?.name as string}
        gender={authState.user?.userDetails?.gender as string}
        birthday={authState.user?.userDetails?.birthday as string}
        imageId={authState.user?.userDetails?.imageId}
        isMyProfile={true}
      />
      <Box mb={2} mx={6}>
        <AlertConfimationDialog
          textHeader={'Delete account'}
          textQuestion={'Are you sure want to delete account?'}
          textConfirm={'Yes'}
          textCancel={'No'}
          isOpen={deleteConfirmationAlertVisible}
          onConfirm={() => {
            if (user?.userDetails?.id) {
              deleteUserHandler().then()
              if (status.status === QueryStatus.fulfilled) {
                auth().signOut().then()
              } else {
                setDeleteConfirmationAlertVisible(false)
                toast.show({
                  description: 'Oops, something went wrong, try again',
                })
              }
              setDeleteConfirmationAlertVisible(false)
            }
          }}
          onCancel={() => setDeleteConfirmationAlertVisible(false)}
        />
        <Button
          backgroundColor={'danger.600'}
          onPress={() => {
            setDeleteConfirmationAlertVisible(true)
          }}
        >
          Delete account
        </Button>
      </Box>
      <Box mb={2} mx={6}>
        <Button
          onPress={() => {
            auth().signOut().then()
          }}
          variant={'outline'}
        >
          Sign Out
        </Button>
      </Box>
    </Flex>
  )
}
