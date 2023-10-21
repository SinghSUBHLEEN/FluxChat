import { ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure, Button, Modal, ModalBody, ModalHeader, useToast, FormControl, Input, Stack, Skeleton, Box, IconButton, InputLeftAddon, InputGroup, Tooltip, InputLeftElement } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BiSearch, BiSolidPencil } from 'react-icons/bi';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeItem from './UserBadgeItem';
import SkeletonCustom from '../SkeletonCustom/SkeletonCustom';
import { ChatState } from '../Context/ChatProvider';
import cookie from 'js-cookie';
import { Spinner } from 'react-bootstrap';
import OverlaySpinner from "../OverlaySpinner/OverlaySpinner";
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

export default function UpdateGroupModal({ children, fetchAgain, setFetchAgain, fetchMessages }) {

    const { selectedChat, setSelectedChat, chats, setChats, socket, socketConnected } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nameLock, setNameLock] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [addedUsers, setAddedUsers] = useState([]);
    const [removedUsers, setRemovedUsers] = useState([]);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const toast = useToast();

    const handleAdd = async (user) => {
        if (selectedUsers.filter(curr => curr._id === user._id).length) {
            toast({
                description: "Member already present",
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try {
            setLoadingUpdate(true);
            const { data } = await axios.put("/api/chat/add", { chatId: selectedChat._id, userId: user });
            // setSelectedChat(data);
            // setSelectedUsers([data, ])
            console.log(data);
            setSelectedUsers([user, ...selectedUsers]);
            setFetchAgain(!fetchAgain);
            // fetchMessages();
            setLoadingUpdate(false);
        } catch (error) {
            toast({
                title: error.message,
                duration: 4000,
                position: 'bottom',
                isClosable: true,
                status: "error"
            })
        }
    }



    const handleRemove = async (user) => {
        if (selectedChat.groupAdmin[0]._id !== cookie.get("_id") && user._id !== cookie.get("_id")) {
            toast({
                title: "Only admin can remove members",
                status: "warning",
                duration: 4000,
                position: 'bottom',
                isClosable: true
            })
            return;
        }
        if (selectedUsers.length <= 3) {
            toast({
                description: "Group should have atleast 3 members",
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        try {
            setLoadingUpdate(true);
            const { data } = await axios.put(
                `/api/chat/remove`,
                {
                    chatId: selectedChat._id,
                    userId: user._id,
                }
            );
            user._id === cookie.get("_id") ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoadingUpdate(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoadingUpdate(false);
        }
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

    const reset = () => {
        setGroupChatName(selectedChat.chatName);
        setSelectedUsers(selectedChat.users);
        setSearch("");
        setSearchResult([]);
        setLoading(false);
        setNameLock(true);
    }

    const handleRename = async () => {
        if (nameLock) return;
        try {
            setUpdateLoading(true);
            const { data } = await axios.put("/api/chat/rename", { chatId: selectedChat._id, chatName: groupChatName });
            socket.emit("fetch again rename", { chatName: groupChatName, userName: cookie.get("name"), prevName: selectedChat.chatName, user: selectedChat.users });
            setUpdateLoading(false);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setUpdateLoading(false);
        } catch (error) {
            console.log(error);
            toast({
                title: "Failed!",
                description: "couldn't update the group at this moment",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom"
            });
            setUpdateLoading(false);
        }
        setNameLock(true);
    }

    useEffect(() => {
        setGroupChatName(selectedChat.chatName);
        setSelectedUsers(selectedChat.users);
        setSearch("");
        setSearchResult([]);
        setLoading(false);
        setNameLock(true);
    }, [selectedChat]);

    useEffect(() => {

        return () => {
            setSearch("");
            setSearchResult([]);
            setLoading(false);
        }
    }, []);

    return <>
        <span onClick={onOpen}>{children}</span>

        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={() => {
            onClose()
            reset()
        }} size="md">
            <ModalOverlay />
            <ModalContent bg="#151515" color="whiteAlpha.800">
                <ModalHeader fontSize="27px"><span>Update Group</span></ModalHeader>
                <ModalCloseButton />
                <ModalBody d="flex" flexDir='column' alignItems="center">
                    {selectedChat.groupAdmin.length > 0 &&
                        (<>
                            <Text display="inline" fontSize="lg">
                                Admins:
                            </Text>
                            <Box display="flex" flexWrap="wrap" mb={1}>
                                {selectedChat.groupAdmin.map(user => <UserBadgeItem user={user} key={user._id} isAdmin={true} />)}
                            </Box>
                        </>)}
                    {selectedUsers.length > 0 &&
                        (<>
                            <Text display="inline" fontSize="lg" mb={1}>
                                Members:
                            </Text>
                            <Box display="flex" flexWrap="wrap" mb={5}>
                                {selectedUsers.map(user => {
                                    if (user._id !== cookie.get("_id"))
                                        return <UserBadgeItem user={user} onDelete={() => handleRemove(user)} key={user._id} />
                                    else return <></>
                                })}
                            </Box>
                        </>)}
                    <FormControl display="flex">
                        <InputGroup>
                            <Tooltip label="Change name" hasArrow><InputLeftAddon
                                p={2}
                                bg="whiteAlpha.300"
                                borderLeftRadius="3xl"
                                cursor="pointer"
                                width="12"
                                borderColor="gray"
                                borderRightWidth={0}
                                onClick={() => setNameLock(false)}
                            >
                                <BiSolidPencil size="lg" />
                            </InputLeftAddon></Tooltip>
                            <Input
                                placeholder='Group name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                value={groupChatName}
                                borderWidth="thin"
                                borderColor="gray"
                                autoComplete='off'
                                borderRightRadius="3xl"
                                borderLeftRadius="0"
                                disabled={nameLock}
                            />
                        </InputGroup>
                        {!updateLoading ?
                            <Button colorScheme='red' borderRadius="3xl" mx={2} onClick={handleRename} boxShadow="dark-lg" style={nameLock ? { cursor: "not-allowed" } : {}} >
                                Update
                            </Button> : <Button bg="red.300" borderRadius="3xl" colorScheme='red' mr={3} disabled={true} boxShadow="dark-lg" _hover={{ bg: "red.300", cursor: "not-allowed" }}  >
                                <Spinner color='white' size='sm'></Spinner></Button>}
                    </FormControl>
                    {selectedChat.groupAdmin[0]._id === cookie.get("_id") && <form className='m-0 p-0'>
                        <FormControl className='d-flex mt-2'>
                            <InputGroup>
                                <InputLeftElement fontSize={"x-large"} mx={1}><AiOutlineUsergroupAdd /></InputLeftElement>
                                <Input
                                    placeholder='Add new members'
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
                    </form>}
                    {loading ?
                        <Stack>
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                        </Stack> :
                        <>
                            {searchResult.slice(0, 7).map(user => {
                                return <UserListItem key={user._id} user={user} handleOnClick={() => handleAdd(user)} />
                            })}
                        </>}

                </ModalBody>
            </ModalContent>
        </Modal >
        {!updateLoading && <OverlaySpinner />}
    </>
}
