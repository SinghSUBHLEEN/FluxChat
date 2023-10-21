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

function Chat() {

    const navigate = useNavigate();
    const [cook, setCook] = useState(cookie.get("token"));
    const [search, setSearch] = useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);
    const { loadingChat, setLoadingChat } = ChatState();

    useEffect(() => {
        setCook(cookie.get("token"));
        if (!cook) navigate("/auth/login");
    }, []);

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
                {cook && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {cook && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    </div>
    )
}

export default Chat
