import { memo } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, useToast } from "@chakra-ui/react";
import SingleChat from './SingleChat';
import MessageIcon from '../../images/messageIcon';


function ChatBox(props) {


    const { selectedChat, setSelectedChat, setChats, chats } = ChatState();
    const toast = useToast();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="red.50"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="medium"
            borderColor="blackAlpha.200"
        >
            <SingleChat {...props}></SingleChat>
        </Box>
    )
}

export default memo(ChatBox);
