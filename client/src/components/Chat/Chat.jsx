import { useEffect, useState } from "react"
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { Box, Modal, ModalContent, ModalOverlay, useToast } from "@chakra-ui/react";
import Header from "../Header/Header";
import "./Chat.css";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import { SyncLoader } from "react-spinners";
import axios from "axios";

function Chat() {

    const navigate = useNavigate();
    const [fetchAgain, setFetchAgain] = useState(false);
    const { loadingChat, setLoadingChat, socket, setChats, chats, setSelectedChat } = ChatState();
    const toast = useToast();

    const fetchChats = async (chatId) => {
        try {
            const { data } = await axios.get("/api/chat");
            setChats(data);
            data.forEach(chat => {
                if (chat._id === chatId) setSelectedChat(chat);
            });
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
        }
    }

    useEffect(() => {
        if (!cookie.get("token")) navigate("/auth/login");
    }, []);

    useEffect(() => {
        socket.on("fetch again rename", ({ chatName, userName, prevName, curr, chatId }) => {
            // setFetchAgain(!fetchAgain);
            fetchChats(chatId);
            if (curr !== cookie.get("_id"))
                return toast({
                    description: userName + " updated name of " + prevName + " to " + chatName,
                    duration: 4000,
                    position: "bottom",
                    isClosable: true,
                    status: "info"
                });
        })

        socket.on("members updated", ({ chatName, adminName }) => {
            toast({
                description: adminName + " updated members of " + chatName,
                duration: 4000,
                position: "bottom",
                isClosable: true,
                status: "info"
            });
        })

    }, [])

    return (<div className="d-flex" style={{ flexDirection: "column", width: "100%", height: "100%" }}>
        <Header />
        <div style={{ width: "100%" }}>
            {loadingChat && <>
                <Modal isOpen={true}>
                    <ModalOverlay />
                    <ModalContent bg="transparent" ml="auto"
                        mr="auto"
                        mt="auto"
                        mb="auto">
                        <SyncLoader
                            style={{ marginLeft: "auto", marginRight: "auto" }}
                            size={20}
                            color='#e53e3e'
                            speedMultiplier={0.85}
                        />
                    </ModalContent>
                </Modal>
            </>}
            <Box display="flex" justifyContent="space-between" w="100%" h="90vh" p="10px" maxHeight="90vh">
                {cookie.get("_id") && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {cookie.get("_id") && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    </div>
    )
}

export default Chat
