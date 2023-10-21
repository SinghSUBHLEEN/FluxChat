import { ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure, Button, Modal, ModalBody, ModalHeader, useToast, FormControl, Input, Stack, Skeleton, Box, IconButton, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeItem from './UserBadgeItem';
import SkeletonCustom from '../SkeletonCustom/SkeletonCustom';
import { Spinner } from 'react-bootstrap';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import cookie from 'js-cookie';
import io from 'socket.io-client';

export default function GroupChatModal({ children, fetchAgain, setFetchAgain, }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const [state, setState] = useState(0);
    const { chats, setChats, socket, socketConnected, } = ChatState();
    const toast = useToast();

    useEffect(() => {
        setLoading(false);
        setSearchResult([]);
        setSearch("");
        setSelectedUsers([]);
        setGroupChatName("");
    }, [state]);

    const reset = () => {
        onClose();
        setState(state + 1);
        setState(state - 1);
    }


    const handleAdd = async (user) => {
        if (selectedUsers.filter(each => each._id === user._id).length > 0) {
            toast({
                title: "User already present",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        else {
            setSelectedUsers([user, ...selectedUsers]);
        }
    }

    const handleRemove = async (user) => {
        if (!selectedUsers.includes(user)) return;
        else setSelectedUsers(selectedUsers.filter((curr) => curr !== user));
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/search/${search}`);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            console.log(error.message);
            toast({
                title: "Error Occured!",
                description: "Failed to load the search results",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    const handleSubmit = async () => {

        if (!groupChatName) {
            toast({
                title: "Please provide group name",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        if (selectedUsers.length === 0) {
            toast({
                title: "Please select members",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        if (selectedUsers.length === 1) {
            toast({
                title: "Cannot create group with 2 members!",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try {
            setCreateLoading(true);

            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => user._id)),
            });
            socket.emit("fetch again", { users: selectedUsers, chatName: groupChatName, admin: cookie.get("name") });
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "Group created",
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            });
            setCreateLoading(false);
            setSelectedUsers([]);
            setGroupChatName("");
        } catch (error) {
            console.log(error);
            setCreateLoading(false);
            onClose();
        }
    }



    return <>
        <span onClick={onOpen}>{children}</span>

        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={() => {
            reset()
            onClose()
        }} size="md">
            <ModalOverlay />
            <ModalContent bg="#151515" color="whiteAlpha.800">
                <ModalHeader fontSize="27px"><span>Create Group</span></ModalHeader>
                <ModalCloseButton />
                <ModalBody d="flex" flexDir='column' alignItems="center" >
                    {selectedUsers.length > 0 &&
                        (<>
                            <Text display="block" color="white" fontSize="lg">
                                Selected members:
                            </Text>
                            <Box display="flex" flexWrap="wrap" mb={5}>
                                {selectedUsers.map(user => <UserBadgeItem user={user} onDelete={() => handleRemove(user)} key={user._id} />)}
                            </Box>
                        </>)}
                    <FormControl>
                        <InputGroup>
                            <InputLeftElement fontSize={"x-large"} mx={1}><MdDriveFileRenameOutline /></InputLeftElement>
                            <Input
                                placeholder='Group name'
                                mb={3}
                                value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}
                                borderWidth="thin"
                                borderColor="gray"
                                autoComplete='off'
                                borderRadius="3xl"
                            />
                        </InputGroup>
                    </FormControl>
                    <form className='m-0 p-0'>
                        <FormControl className='d-flex'>
                            <InputGroup>
                                <InputLeftElement fontSize={"x-large"} mx={1}><AiOutlineUsergroupAdd /></InputLeftElement>
                                <Input
                                    placeholder='Add members'
                                    mb={4}
                                    onChange={e => setSearch(e.target.value)}
                                    autoComplete='off'
                                    borderWidth="thin"
                                    borderColor="gray"
                                    borderRadius="3xl"
                                />

                            </InputGroup>

                            <IconButton isRound="true" type="submit" colorScheme='red' fontSize="1.7rem" mx={2} px={4} onClick={handleSearch} icon={<BiSearch />} />
                        </FormControl>
                    </form>
                    {/* render selected users */}

                    {loading ?
                        <Stack>
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                        </Stack> :
                        <>
                            {searchResult.slice(0, 5).map(user => {
                                return <UserListItem key={user._id} user={user} handleOnClick={() => handleAdd(user)} />
                            })}
                        </>}

                </ModalBody>

                <ModalFooter>
                    {!createLoading ?
                        <Button colorScheme='red' mr={3} onClick={handleSubmit} boxShadow="dark-lg">
                            Create</Button> : <Button bg="red.300" colorScheme='red' mr={3} disabled={true} boxShadow="dark-lg" _hover={{ bg: "red.300", cursor: "not-allowed" }}  >
                            <Spinner color='white' size='sm'></Spinner></Button>
                    }
                    <Button variant="solid" colorScheme="whiteAlpha" onClick={reset}>Cancel</Button>

                </ModalFooter>
            </ModalContent>
        </Modal >
    </>
}
