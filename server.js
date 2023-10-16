require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const socket = require("socket.io");
const mongoose = require("mongoose");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* MongoDB Models and Connections */

const connectDB = require("./models/connectDB");
connectDB();
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Chat = require("./models/chatModel");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  Middlewares */

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/client/public/build'));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////* Routes */

const indexRouter = require('./routes/homeRoute');
// const usersRouter = require('./routes/users');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const currServer = app.listen(5000, console.log("Listening at port 5000"));

const io = socket(currServer, {
    cors: {
        origin: "localhost:3000",
        methods: ["GET", "POST", "PUT"]
    }
});

io.on("connection", socket => {
    io.emit("all", { message: "New user joined the chat", _id: socket.id });
})