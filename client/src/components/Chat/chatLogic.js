
export const getSender = (loggedUser, users) => {
    // if (!users || users.length <= 1) return "none";
    return (users[0]._id == loggedUser ? users[1].name : users[0].name);
}

export const getProfile = (loggedUser, users) => {
    // if (!users || users.length <= 1) return "none";
    return (users[0]._id === loggedUser ? users[1].profile : users[0].profile);
}


export const isValidChat = (search, chat) => {
    if (chat.users.length <= 1) return true;
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

export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};