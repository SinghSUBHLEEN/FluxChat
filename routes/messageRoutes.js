const express = require('express');
const router = express.Router();
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// send message
router.post("/", async (req, res) => {

    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("No content or chatId provided");
        return res.status(400);
    }

    let newMessage = {
        sender: req.cookies._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);
        message = await Message.findOne({ _id: message._id }).populate("sender", "name profile").populate("chat");
        let e = await User.populate(message, {
            path: "chat.users",
            select: "name profile",
        });
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: e });
        res.status(200).json(message);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }

})


// fetch all massages with a particular chat id
router.get('/:chatId', async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name profile").populate("chat");
        res.json(messages);
    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message);
    }
})


module.exports = router;
