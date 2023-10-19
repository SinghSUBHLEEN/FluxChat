import { memo } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, useToast } from "@chakra-ui/react";
import SingleChat from './SingleChat';


function ChatBox(props) {


    const { selectedChat, setSelectedChat, setChats, chats } = ChatState();
    const toast = useToast();

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
            <SingleChat {...props}></SingleChat>
        </Box>
    )
}

export default memo(ChatBox);
