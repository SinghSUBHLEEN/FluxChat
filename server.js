require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const socket = require("socket.io");
const https = require('https');


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
        origin: `*`,
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

    socket.on("typing", ({ users, curr }) => {
        if (!users) return;
        users.forEach(it => {
            if (it._id !== curr) socket.in(it._id).emit("typing");
        });
    });
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("fetch again", ({ users, chatName, admin }) => {
        if (!users) return;
        users.forEach(it => {
            // if (it._id === ._id) return;
            socket.in(it._id).emit("fetch again", { chatName, admin });
        });

    });

    socket.on("fetch again chat", ({ users, id }) => {
        if (!users) return;
        users.forEach(it => {
            // if (it._id === ._id) return;
            socket.in(it._id).emit("fetch again chat", { id });
        });

    });

    socket.on("fetch again rename", ({ users, chatName, userName, prevName, curr, chatId }) => {
        if (!users) return;
        users.forEach(it => {
            if (it._id !== curr) socket.in(it._id).emit("fetch again rename", { chatName, userName, prevName, curr, chatId });
        });
    });

    let willEmit = true;

    socket.on("members updated", ({ chatName, users, curr, adminName }) => {
        if (willEmit) {
            if (!users) return;
            users.forEach(it => {
                if (it._id !== curr) socket.in(it._id).emit("members updated", { chatName, adminName });
            });
            setTimeout(() => {
                willEmit = false;
            }, 30000);
        }
    })

})


const handler = async (event, context) => {
    const url = 'https://fluxchat.onrender.com/';

    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log("done");
                resolve({
                    statusCode: 200,
                    body: 'Server pinged successfully',
                });
            } else {
                reject(
                    new Error(`Server ping failed with status code: ${res.statusCode}`)
                );
            }
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
};

handler();
