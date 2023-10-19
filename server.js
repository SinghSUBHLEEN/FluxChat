require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const socket = require("socket.io");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* MongoDB Models and Connections */

const connectDB = require("./controllers/connectDB");
connectDB();
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Chat = require("./models/chatModel");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  Middlewares */

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/client/dist'));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////* Routes */

const userRouter = require("./routes/userRoutes");
const searchRouter = require("./routes/searchRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");

app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// const usersRouter = require('./routes/users');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const currServer = app.listen((process.env.PORT || 5000), console.log("Listening at port 5000"));

const corsOption = {
    origin: "https://api.cloudinary.com",
    optionsSuccessStatu: 204,
}

app.all('*', cors(corsOption), (req, res) => {
    res.status(201).sendFile(__dirname + "/client/dist/index.html");
})


const io = socket(currServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
    },
    pingTimeout: 60000,
});

io.on("connection", socket => {
    io.emit("all", { message: "New user joined the chat", _id: socket.id });
    socket.on("setup", (userId) => {
        socket.join(userId);
        socket.emit('connected', { message: "connected to socket.io" });
    })

    socket.on("join_chat", (room) => {
        socket.join(room);
    })

    socket.on("new_message", (obj) => {
        let chat = obj.chat;
        if (!chat.users) return;

        chat.users.forEach(it => {
            if (it._id === obj.sender._id) return;
            socket.in(it._id).emit("message_recieved", obj);
        });

    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
})