import { createContext, useContext, useEffect, useState } from "react";
import cookie from "js-cookie";

const ChatContext = createContext();


const ChatProvider = ({ children }) => {

    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);

    useEffect(() => {
        const userInfo = cookie.get("token");
        setUser(userInfo);

    }, [])

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, loadingChat, setLoadingChat }}>
        {children}
    </ChatContext.Provider>
}



export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;