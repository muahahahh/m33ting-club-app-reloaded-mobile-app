import { AlertDialog, Button } from 'native-base'
import React from 'react'

type AlertConfirmationDialogParams = {
  textHeader: string
  textQuestion: string
  textConfirm: string
  textCancel: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const AlertConfimationDialog: React.FC<AlertConfirmationDialogParams> = ({
  textHeader,
  textQuestion,
  textConfirm,
  textCancel,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = React.useRef(null)
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onCancel}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialog.Content width={'90%'}>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{textHeader}</AlertDialog.Header>
        <AlertDialog.Body>{textQuestion}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={3}>
            <Button onPress={onCancel} width={100}>
              {textCancel}
            </Button>
            <Button colorScheme="danger" onPress={onConfirm} width={100}>
              {textConfirm}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}

export default AlertConfimationDialog
