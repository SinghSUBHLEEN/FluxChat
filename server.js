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

const authRouter = require("./routes/authRoute");

app.use("/api/auth", authRouter);


// const usersRouter = require('./routes/users');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const currServer = app.listen(5000, console.log("Listening at port 5000"));

app.all('*', (req, res) => {
    res.status(201).sendFile(__dirname + "/index.html");
})


const io = socket(currServer, {
    cors: {
        origin: "localhost:5173",
        methods: ["GET", "POST", "PUT"]
    }
});

io.on("connection", socket => {
    io.emit("all", { message: "New user joined the chat", _id: socket.id });
})