import { useEffect, useState, memo } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Badge, Box, Button, FormControl, Input, InputGroup, InputLeftElement, Skeleton, SkeletonCircle, Stack, Text, Tooltip, useToast } from "@chakra-ui/react";
import axios from 'axios';
import cookie from "js-cookie";
import { HiUserGroup } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { getProfile, getSender, isValidChat } from './chatLogic';
import GroupChatModal from "../GroupChatModal/GroupChatModal";
import SkeletonCustom from '../SkeletonCustom/SkeletonCustom';

function MyChats({ fetchAgain, setFetchAgain }) {

    const [loggedUser, setLoggedUser] = useState("");
    const { selectedChat, setSelectedChat, setChats, chats } = ChatState();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const fetchChats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/chat");
            setLoading(false);
            setChats(data);

        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured!",
                description: "Failed to fetch the chats",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false);
        }
    }

    useEffect(() => {
        if (cookie.get("_id"))
            setLoggedUser(cookie.get("_id"));
        // if (cook) setLoggedUser(JSON.parse(cook));
    })

    useEffect(() => {
        // if (cookie.get("_id"))
        //     setLoggedUser(cookie.get("_id").substring(3).slice(0, -1));
        // console.log(loggedUser);
        fetchChats();
    }, [fetchAgain]);


    return <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        mb={3}
        bg="inherit"
        color="white"
        boxShadow='lg'
        w={{ base: "100%", md: "31%" }}
        height="fit-content"
        // overflowY="hidden"
        borderRadius="2xl"
        borderWidth="thin"
        borderColor="whiteAlpha.500"
    >
        <Box
            pb={3}
            px={3}
            fontSize={{ base: '28px', md: "30px" }}
            d="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
        >Chats
            <GroupChatModal>
                <Tooltip label="create group" hasArrow >
                    <Button
                        d="flex"
                        fontSize="x-large"
                        colorScheme='red'
                        float="right"
                        m={2}>
                        <HiUserGroup />
                    </Button>
                </Tooltip>
            </GroupChatModal>

            <FormControl className='mb-2'>
                <InputGroup color="whiteAlpha.700">
                    <InputLeftElement pointerEvents='none'>
                        <BiSearch fontSize="1.3rem" />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search chats' backgroundColor="whiteAlpha.200" onChange={(e) => setSearch(e.target.value)} value={search} border={0} />
                </InputGroup>
            </FormControl>

            <Box
                d="flex"
                flexDir="column"
                bg="inherit"
                w="100%"
                h="100%"
                color="white"
                borderRadius="lg"
                overflowY="scroll"
                maxHeight="67.65vh"
                height="fit-content"
            >
                {chats.length ? <>
                    <Stack overflowY="hidden" width="auto">
                        {chats.length && chats.map(chat => {
                            if (isValidChat(search, chat))
                                return <></>
                            else
                                return <>
                                    <Box
                                        onClick={() => setSelectedChat(chat)}
                                        cursor="pointer"
                                        overflowY="hidden"
                                        d="flex"
                                        bg={selectedChat === chat ? "red.400" : "whiteAlpha.100"}
                                        w="100%"
                                        px={3}
                                        py={2}
                                        borderRadius="lg"
                                        key={chat._id}
                                        borderWidth="thin"
                                        borderColor="whiteAlpha.600"
                                    >
                                        <div className='d-flex'>
                                            <div style={{ flex: 0.1, paddingTop: "auto", paddingBottom: "auto" }}><Avatar
                                                mr={2}
                                                size='md'
                                                cursor="pointer"
                                                src={!chat.isGroupChat ? getProfile(loggedUser, chat.users) : chat.chatName}
                                                name={!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                            />
                                            </div>
                                            <div style={{ flex: 0.9, overflow: "hidden", display: "inline" }}>
                                                {/* <Box display="inline" px="3" style={{ marginTop: "auto", marginBottom: "auto" }}>
                                            
                                        </Box> */}
                                                <span style={{ display: "block", fontSize: "1.35rem", width: "100%" }}>
                                                    {(!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName).length > 18 ? (!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName).slice(0, 16) + "..." : (!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName)}
                                                </span>
                                                <span style={{ display: "block", fontSize: "medium" }}>{"latest message"}</span>
                                            </div>
                                        </div>
                                        {/* <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                </Text> */}
                                    </Box>
                                </>
                        })}
                    </Stack>
                </> :
                    (loading &&
                        <Stack>
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                            <SkeletonCustom />
                        </Stack>)}

            </Box>
        </Box>
    </Box >;
}

export default memo(MyChats);
