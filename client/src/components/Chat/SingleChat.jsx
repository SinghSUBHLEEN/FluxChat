import { Box, IconButton, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { MdKeyboardBackspace } from "react-icons/md";
import MessageIcon from '../../images/messageIcon';
import { SyncLoader } from "react-spinners";
import { getSender } from './chatLogic';
import cookie from "js-cookie";


export default function SingleChat({ fetchAgain, setFetchAgain }) {


    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, notification, setNotification } = ChatState();


    useEffect(() => {
        console.log(selectedChat);
    })


    return <>

        {selectedChat ? <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
        > <IconButton
                onClick={() => setSelectedChat("")}
                colorScheme='red'
                aria-label='Call Segun'
                size='md'
                icon={<MdKeyboardBackspace fontSize="1.6rem" />}
            /><span style={{ marginLeft: "auto", marginRight: "auto" }}>{selectedChat.isGroupChat ? selectedChat.chatName : getSender(cookie.get("_id"), selectedChat.users)}</span></Text> : <></>}

        {selectedChat ? <></> : <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Text fontSize="3xl" pb={3} display="flex">
                <MessageIcon width={80} height={80} />
                <span style={{ marginTop: "auto", display: "flex" }}>Start Chatting<SyncLoader size={5} style={{ marginBottom: "7px", marginTop: "auto" }} /></span>
            </Text>
        </Box>}
    </>
}
