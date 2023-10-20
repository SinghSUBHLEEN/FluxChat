import { useState } from 'react';
import { Avatar, Box, Button, FormControl, FormLabel, IconButton, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { BiSearch, BiSolidPencil } from 'react-icons/bi';
import SkeletonCustom from '../SkeletonCustom/SkeletonCustom';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeItem from '../GroupChatModal/UserBadgeItem';
import { MdAlternateEmail } from "react-icons/md";
import cookie from "js-cookie";

function UserModal({ children }) {


    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    return <>
        <span onClick={onOpen}>{children}</span>

        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent bg="#151515" color="whiteAlpha.800">
                <ModalHeader fontSize="27px"><span>User profile</span></ModalHeader>
                <ModalCloseButton />
                <ModalBody flexDir='column' alignItems="center" w="100%" >
                    <div className='m-2 mb-4' style={{ display: "flex", justifyContent: "center" }}>
                        <span><Avatar src={cookie.get("img")} name={cookie.get("name")} size='2xl' /></span>
                    </div>
                    <form className='m-0 p-0'>
                        <FormControl>
                            <InputGroup>
                                <InputLeftAddon
                                    p={2}
                                    bg="whiteAlpha.100"
                                    borderLeftRadius="3xl"
                                    width="12"
                                    borderColor="gray"
                                    borderRightWidth={0}
                                ><BiSolidPencil size="lg" />
                                </InputLeftAddon>
                                <Input
                                    placeholder='name'
                                    mb={3}
                                    value={cookie.get("name")}
                                    borderWidth="thin"
                                    borderColor="gray"
                                    autoComplete='off'
                                    borderRadius="3xl"
                                    disabled={true}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon
                                    p={2}
                                    bg="whiteAlpha.100"
                                    borderLeftRadius="3xl"
                                    width="12"
                                    borderColor="gray"
                                    borderRightWidth={0}
                                // onClick={() => setDisName(false)} 
                                >
                                    <MdAlternateEmail size="lg" />
                                </InputLeftAddon>
                                <Input
                                    placeholder='name'
                                    mb={3}
                                    value={cookie.get("email")}
                                    borderWidth="thin"
                                    borderColor="gray"
                                    autoComplete='off'
                                    borderRadius="3xl"
                                    disabled={true}
                                />
                            </InputGroup>
                        </FormControl>
                    </form>
                </ModalBody>

                {/* <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleSubmit} boxShadow="dark-lg">
                        Create
                    </Button>
                    <Button variant="solid" colorScheme="whiteAlpha" onClick={reset}>Cancel</Button>
                </ModalFooter> */}
            </ModalContent>
        </Modal>
    </>
}

export default UserModal;
