import { ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { Modal } from 'react-bootstrap'
import { SyncLoader } from 'react-spinners'

const OverlaySpinner = () => {
    return <>
        <Modal isOpen={true}>
            <ModalOverlay />
            <ModalContent bg="transparent" ml="auto"
                mr="auto"
                mt="auto"
                mb="auto">
                <SyncLoader
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    size={18}
                    color='#e53e3e'
                    speedMultiplier={0.85}
                />
            </ModalContent>
        </Modal>
    </>
}

export default OverlaySpinner;
