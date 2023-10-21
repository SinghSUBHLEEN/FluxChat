const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const jwt = require("jsonwebtoken");

// accessChats from here
router.post("/", async (req, res) => {
    const curr_id = req.cookies._id;
    console.log(curr_id);
    const { userId } = req.body;
    if (!userId) {
        console.log("userid param not sent with request");
        return res.status(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: curr_id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name profile email"
    })

    if (isChat.length > 0) {
        res.json(isChat[0]);
    }
    else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [curr_id, userId],
        }

        try {
            const createChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

});

// to fetch all chats
router.get("/", async (req, res) => {
    const curr_id = jwt.verify(req.cookies.token, process.env.JWT_KEY).id;
    try {
        Chat.find({ users: { $elemMatch: { $eq: curr_id } } }).populate("users", "-pasword").populate("groupAdmin", "-passord").populate("latestMessage").sort({ updatedAt: -1 }).then(async (data) => {
            data = await User.populate(data, {
                path: "lastestMessage.sender",
                select: "name profile email",
            })

            res.status(200).json(data);

        });
    } catch (error) {
        res.status(400);
        console.log(error);
    }
});

// create a group chat
router.post("/group", async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.cookies._id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.cookies._id,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password").select("-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// rename group chats here
router.put("/rename", async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }

});

// remove from group
router.put("/remove", async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(removed);
    }
});


// add to group
router.put("/add", async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    console.log(added);
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(added);
    }
});

module.exports = router;