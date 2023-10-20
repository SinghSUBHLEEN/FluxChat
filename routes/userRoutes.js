const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/auth/login', async (req, res) => {
    const { email, password, rem } = req.body;
    if (!email || !password)
        res.status(400).json({ message: "", error: "Please provide all required fields" });
    else {
        const getUser = await User.findOne({ email: email });
        if (!getUser)
            res.status(400).json({ message: "", error: "User doen't exist" });
        else {
            bcrypt.compare(password, getUser.password, async (err, correct) => {
                if (err)
                    res.status(500).json({ message: "", error: "Something went wrong" });
                else {
                    if (!correct)
                        res.status(400).json({ message: "", error: "Password does not match" });
                    else {
                        const payload = {
                            id: String(getUser._id),
                        };
                        const option = {};
                        if (rem) option.maxAge = 1000 * 60 * 60 * 24 * 15;
                        const token = jwt.sign(payload, process.env.JWT_KEY);
                        res.status(202).cookie('token', token, option).cookie('name', getUser.name, option).cookie('img', getUser.profile, option).cookie("_id", payload.id, option).cookie("email", getUser.email, option).json({ message: "Welcome", error: "" });
                    }
                }
            })
        }
    }
});

router.post('/auth/register', async (req, res) => {
    const { email, password, name, cpass, rem, img } = req.body;
    console.log(req.body);
    if (!email || !password || !name || !cpass)
        res.status(400).json({ message: "", error: "Please provide all required fields" });
    else {
        if (cpass !== password)
            res.status(400).json({ message: "", error: "Passwords do not match" });
        else {
            const getUser = await User.findOne({ email: email });
            if (getUser)
                res.status(400).json({ message: "", error: "User already exists" });
            else {
                bcrypt.hash(password, 10, async (err, hash) => {
                    if (err)
                        res.status(500).json({ message: "", error: "Something went wrong" });
                    else {
                        const obj = { name: name, email: email, password: hash }
                        if (img !== "") obj.profile = img;
                        const newUser = await User.create(obj);
                        if (!newUser)
                            res.status(500).json({ message: "", error: "Something went wrong" });
                        else {
                            const payload = {
                                id: String(newUser._id),
                            };
                            const option = {};
                            if (rem) option.maxAge = 1000 * 60 * 60 * 24 * 15;
                            const token = jwt.sign(payload, process.env.JWT_KEY);
                            res.status(202).cookie('token', token, option).cookie('name', newUser.name, option).cookie('img', newUser.profile, option).cookie("_id", payload.id, option).cookie("email", newUser.email, option).json({ message: "Welcome", error: "" });
                        }
                    }
                });
            }
        }
    }
});



module.exports = router;