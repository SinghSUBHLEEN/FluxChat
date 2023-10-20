import { Avatar, Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState, memo } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { MdKeyboardBackspace } from "react-icons/md";
import MessageIcon from './MessageIconCustom';
import { SyncLoader } from "react-spinners";
import { getSender } from './chatLogic';
import cookie from "js-cookie";
import { IoSendSharp } from "react-icons/io5";
import { AiOutlineArrowUp } from "react-icons/ai";
import axios from 'axios';
import ScrChat from './ScrChat';
import io from "socket.io-client";
import { Dropdown, NavDropdown, Tooltip } from 'react-bootstrap';
import { BsThreeDotsVertical } from "react-icons/bs";


const endPt = "/";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {


    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const curr = newMessage;
            setNewMessage("");
            const { data } = await axios.post("/api/message", { content: curr, chatId: selectedChat._id });
            socket.emit('new_message', data);
            setMessages([...messages, data]);

        } catch (error) {
            toast({
                title: "Error Occured",
                description: "failed to send the message",
                duration: 4000,
                isClosable: true,
                status: "error",
                position: "bottom"
            })
        }
    }


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {

            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`);
            console.log(data);
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

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        socket.emit("typing", selectedChat._id);
        if (!socketConnected) return;
        if (!typing) {
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        const len = 1500;
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
        socket = io(endPt);
        socket.emit("setup", cookie.get("_id"))
        socket.on("connected", () => {
            setSocketConnected(true);
        })
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
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
    })


    return <>

        {selectedChat ? <Text
            fontSize={{ base: "20px", md: "25px" }}
            p={3}
            w="100%"
            bg="whiteAlpha.200"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="left"
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

            <NavDropdown title={<IconButton isRound={true}
                variant="outline" size='md'
                color="white"
                borderWidth="0"
                _hover={{ bg: "whiteAlpha.200" }}
                icon={<BsThreeDotsVertical fontSize="21px" />} />} id="collapsible-nav-dropdown" style={{
                    // width: "7rem",
                    boxShadow: "none",
                    fontSize: "22px"
                }} className="dropDown" >
                <Dropdown.Item style={{ color: "white" }}> <div className="m-0 p-0 d-flex"><span>adasdadads</span></div></Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item style={{ color: "white" }}><div className="m-0 p-0 d-flex"><span>{" " + " Logout"}</span></div></Dropdown.Item>
            </NavDropdown>


        </Text> : <></>}

        {!selectedChat ? <Box display="flex" alignItems="center" justifyContent="center" height="100%">
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
                        <div className='messages'><ScrChat messages={messages} /></div></>}
                <form className='m-0 p-0'>
                    {/* {istyping ? <div>Loading...</div> : <></>} */}
                    <FormControl isRequired mt={3} display="flex">
                        <Input
                            borderWidth={0}
                            bg="whiteAlpha.200"
                            display="inline"
                            placeholder='Type a message'
                            value={newMessage}
                            color="whiteAlpha.700"
                            borderRadius="3xl"
                            onChange={typingHandler}
                        />
                        <IconButton colorScheme="red" isRound="true" fontSize="2xl" type="submit" ml={2} icon={<AiOutlineArrowUp />} onClick={sendMessage} />
                    </FormControl>
                </form>
            </Box>
        </>}
    </>
}


export default memo(SingleChat);