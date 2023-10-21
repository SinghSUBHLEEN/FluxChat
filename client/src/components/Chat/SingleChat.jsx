import { Avatar, Box, Button, FormControl, IconButton, Input, InputGroup, InputLeftAddon, Spinner, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState, memo } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { MdKeyboardBackspace } from "react-icons/md";
import MessageIcon from './MessageIconCustom';
import { SyncLoader } from "react-spinners";
import { getSender } from './chatLogic';
import cookie from "js-cookie";
import { PiChatsTeardropDuotone } from "react-icons/pi";
import { AiFillEdit, AiOutlineArrowUp } from "react-icons/ai";
import axios from 'axios';
import ScrChat from './ScrChat';
import io from "socket.io-client";
import { Dropdown, NavDropdown, Tooltip } from 'react-bootstrap';
import { BsThreeDotsVertical } from "react-icons/bs";
import Typing from "./Typing"
import { CgLogOut } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import UpdateGroupModal from '../GroupChatModal/UpdateGroupModal';

var selectedChatCompare

function SingleChat({ fetchAgain, setFetchAgain }) {


    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [lockInput, setLockInput] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, socket, socketConnected } = ChatState();

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const curr = newMessage;
            setNewMessage("");
            setLockInput(true);
            const { data } = await axios.post("/api/message", { content: curr, chatId: selectedChat._id });
            socket.emit('new_message', data);
            setMessages([...messages, data]);
            setLockInput(false);

        } catch (error) {
            toast({
                title: "Error Occured",
                description: "failed to send the message",
                duration: 4000,
                isClosable: true,
                status: "error",
                position: "bottom"
            })
            setLockInput(false);
        }
    }


    const fetchMessages = async () => {
        if (!selectedChat) return;
        // console.log(selectedChat);
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`);
            // console.log(data);
            setMessages(data);
            setLoading(false);
            socket.emit("join_chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error occured!",
                description: "Failed to fetch mesagges",
                status: "error",
                duration: "4000",
                isClosable: true,
                position: "bottom"
            })
        }
    }


    const leaverGroupHandler = async () => {
        try {
            const { data } = await axios.put(
                `/api/chat/remove`,
                {
                    chatId: selectedChat._id,
                    userId: cookie.get("_id"),
                }
            );
            setSelectedChat();
            setFetchAgain(!fetchAgain);
            fetchMessages();
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const typingHandler = (e) => {
        if (!socketConnected) return;
        setNewMessage(e.target.value);
        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        const len = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= len && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, len)
    }

    useEffect(() => {
        if (selectedChatCompare !== selectedChat)
            fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    useEffect(() => {

        socket.on("message_recieved", (obj) => {
            if (!selectedChatCompare || selectedChatCompare._id !== obj.chat._id) {
                // give notification      

            } else {
                setMessages([...messages, obj]);
            }
        })
        socket.on("typing", () => {
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false);
            }, 4000)
        });
        socket.on("stop typing", () => {
            setIsTyping(false)
        });


    });


    return <>

        {selectedChat && <Text
            fontSize={{ base: "20px", md: "25px" }}
            p={3}
            w="100%"
            bg="whiteAlpha.200"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="left"
            borderWidth={0}
        > <IconButton
                onClick={() => setSelectedChat("")}
                isRound={true}
                variant="outline"
                aria-label='Call Segun'
                size='md'
                color="white"
                borderWidth="0"
                _hover={{ bg: "whiteAlpha.200" }}
                icon={<MdKeyboardBackspace fontSize="25px" />}
            /><span style={{ marginRight: "auto", marginLeft: "7px" }}>{(selectedChat.isGroupChat ? selectedChat.chatName : getSender(cookie.get("_id"), selectedChat.users)).length > 30 ? (selectedChat.isGroupChat ? selectedChat.chatName : getSender(cookie.get("_id"), selectedChat.users)).slice(0, 28) + "..." : (selectedChat.isGroupChat ? selectedChat.chatName : getSender(cookie.get("_id"), selectedChat.users))}</span>

            {selectedChat.isGroupChat && <NavDropdown title={<IconButton isRound={true}
                variant="outline" size='md'
                color="white"
                borderWidth="0"
                _hover={{ bg: "whiteAlpha.200" }}
                icon={<BsThreeDotsVertical fontSize="21px" />} />} id="collapsible-nav-dropdown" style={{
                    // width: "7rem",
                    boxShadow: "none",
                    fontSize: "22px"
                }} className="dropDown" >
                <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}><Dropdown.Item style={{ color: "white" }} >

                    <Box className="m-0 p-0 d-flex" _hover={{ color: "gray" }}>
                        <span className='mx-1'><AiFillEdit size="25px" /></span>
                        <span>Edit group</span>
                    </Box>

                </Dropdown.Item>
                </UpdateGroupModal>
                <Dropdown.Divider className='my-1' />
                <Dropdown.Item style={{ color: "white" }} onClick={leaverGroupHandler} >
                    <Box className="m-0 p-0 d-flex" _hover={{ color: "gray" }}>
                        <span className='mx-1'><CgLogOut size="25px" /></span>
                        <span>Leave group</span>
                    </Box>
                </Dropdown.Item>
            </NavDropdown>}
        </Text>}

        {
            !selectedChat ? <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="3xl" pb={3} display="flex">
                    <MessageIcon width={80} height={80} />
                    <span style={{ marginTop: "auto", display: "flex", marginLeft: "6px", marginRight: "10px" }}>Start Chatting<SyncLoader size={5} style={{ marginBottom: "7px", marginTop: "auto" }} color='white' speedMultiplier={0.6} /></span>
                </Text>
            </Box> : <>
                <Box display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#060606"
                    boxShadow="dark-lg"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    borderTopRadius="0"
                    overflowY="scroll">
                    {loading ? <>
                        <Spinner color='red' size="xl" alignSelf="center" margin="auto" thickness='3px' />
                    </> :
                        <>
                            <div className='messages'><ScrChat messages={messages} typing={istyping} /></div></>}
                    <form className='m-0 p-0'>
                        <FormControl isRequired mt={3} display="flex">
                            {/* {istyping ? <div style={{ fontSize: "10rem", color: "white" }}>Loading...</div> : <></>} */}
                            {/* {istyping && <Typing />} */}
                            <InputGroup>
                                <InputLeftAddon
                                    p={2}
                                    bg="whiteAlpha.200"
                                    color="whiteAlpha.800"
                                    borderLeftRadius="3xl"
                                    cursor="pointer"
                                    width="12"
                                    borderWidth={0}
                                >
                                    <PiChatsTeardropDuotone size="lg" />
                                </InputLeftAddon>
                                <Input
                                    borderWidth={0}
                                    bg="whiteAlpha.200"
                                    display="inline"
                                    placeholder='Type a message'
                                    value={newMessage}
                                    color="whiteAlpha.700"
                                    borderRadius="3xl"
                                    onChange={typingHandler}
                                    autoComplete='off'
                                    disabled={lockInput}
                                />
                            </InputGroup>
                            <IconButton colorScheme="red" isRound="true" fontSize="2xl" type="submit" ml={2} icon={<AiOutlineArrowUp />} onClick={sendMessage} />
                        </FormControl>
                    </form>
                </Box>
            </>
        }
    </>
}


export default memo(SingleChat);