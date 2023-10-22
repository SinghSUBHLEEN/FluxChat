import { createContext, useContext, useEffect, useState } from "react";
import cookie from "js-cookie";
import io from "socket.io-client";

const ChatContext = createContext();


const ChatProvider = ({ children }) => {

    const socket = io("http://localhost:5000/");
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        socket.emit("setup", cookie.get("_id"));
        socket.on("connected", () => {
            setSocketConnected(true);
            console.log("connected to socket");
        })
    });

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, loadingChat, setLoadingChat, socket, socketConnected, notification, setNotification }}>
        {children}
    </ChatContext.Provider>
}



export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;