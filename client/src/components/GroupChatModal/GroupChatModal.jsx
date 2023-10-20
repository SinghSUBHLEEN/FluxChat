import { ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure, Button, Modal, ModalBody, ModalHeader, useToast, FormControl, Input, Stack, Skeleton, Box, IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeItem from './UserBadgeItem';
import SkeletonCustom from '../SkeletonCustom/SkeletonCustom';

export default function GroupChatModal({ children }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState(0);
    const { chats, setChats } = ChatState();
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
        if (selectedUsers.includes(user)) {
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
            console.log(data);
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

        if (!selectedUsers) {
            toast({
                title: "No user selected",
                status: "warning",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            });
            return;
        }


        try {
            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => user._id)),
            });
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "Group created",
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "bottom"
            });
            setSelectedUsers([]);
            setGroupChatName("");
        } catch (error) {
            console.log(error);
            onClose();
        }
    }

    return <>
        <span onClick={onOpen}>{children}</span>

        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent bg="#151515" color="whiteAlpha.800">
                <ModalHeader fontSize="27px"><span>Create Group</span></ModalHeader>
                <ModalCloseButton />
                <ModalBody d="flex" flexDir='column' alignItems="center" >
                    <FormControl>
                        <Input
                            placeholder='Group name'
                            mb={3}
                            value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}
                            borderWidth="thin"
                            borderColor="gray"
                            autoComplete='off'
                            borderRadius="3xl"
                        />
                    </FormControl>
                    <form className='m-0 p-0'>
                        <FormControl className='d-flex'>
                            <Input
                                placeholder='Add users'
                                mb={4}
                                onChange={e => setSearch(e.target.value)}
                                autoComplete='off'
                                borderWidth="thin"
                                borderColor="gray"
                                borderRadius="3xl"
                            />



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
                    {selectedUsers.length > 0 &&
                        (<>
                            <Text display="block" color="black" fontSize="lg">
                                Selected users:
                            </Text>
                            <Box d="flex" flexWrap="wrap" mb={5}>
                                {selectedUsers.map(user => <UserBadgeItem user={user} onDelete={() => handleRemove(user)} key={user._id} />)}
                            </Box>
                        </>)}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleSubmit} boxShadow="dark-lg">
                        Create
                    </Button>
                    <Button variant="solid" colorScheme="whiteAlpha" onClick={reset}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    </>
}
