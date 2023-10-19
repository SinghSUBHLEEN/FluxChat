
export const getSender = (loggedUser, users) => {
    // console.log(typeof (users[0]._id));
    return (users[0]._id == loggedUser ? users[1].name : users[0].name);
}

export const getProfile = (loggedUser, users) => {
    return (users[0]._id === loggedUser ? users[1].profile : users[0].profile);
}


export const isValidChat = (search, chat) => {
    if (!search) return false;
    if (chat.isGroupChat) {
        if (!chat.chatName.toLowerCase().includes(search.toLowerCase())) {
            return true;
        }
        return false;
    }
    else {
        if (chat.users[0].name.toLowerCase().includes(search.toLowerCase()))
            return false;
        else if (chat.users[1].name.toLowerCase().includes(search.toLowerCase()))
            return false;
        return true;
    }
}