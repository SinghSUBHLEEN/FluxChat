import { memo, useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, useToast } from "@chakra-ui/react";
import SingleChat from './SingleChat';
import axios from 'axios';


function ChatBox(props) {

    const { selectedChat, setSelectedChat, setChats, chats, socket } = ChatState();
    const toast = useToast();
    const [loading, setLoading] = useState(false);


    const fetchChats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/chat");
            setLoading(false);
            setChats(data);
            // console.log(data);
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


    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={0}
            bg="inherit"
            color="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="thin"
            borderColor="whiteAlpha.500"
        >
            <SingleChat {...props} loading={loading} setLoading={setLoading} fetchChats={fetchChats} />
        </Box>
    )
}

export default memo(ChatBox);
