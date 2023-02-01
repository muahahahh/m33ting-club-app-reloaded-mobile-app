import { Modal, Spinner } from 'native-base'
import React from 'react'

type SpinnerModalParams = {
  isOpen: boolean
}

const SpinnerModal: React.FC<SpinnerModalParams> = ({ isOpen }) => {
  return (
    <Modal
      height={'100%'}
      width={'100%'}
      isOpen={isOpen}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Spinner size={'lg'} color={'white.100'} />
    </Modal>
  )
}

export default SpinnerModal
