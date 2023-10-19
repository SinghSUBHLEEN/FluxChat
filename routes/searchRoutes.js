const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.get("/:search", async (req, res) => {
    const curr_id = jwt.verify(req.cookies.token, process.env.JWT_KEY).id;
    const keyword = req.params.search ? {
        $or: [
            { name: { $regex: req.params.search, $options: "i" } },
            { email: { $regex: req.params.search, $options: "i" } }
        ]
    } : {};

    const searchUsers = await User.find(keyword).find({ _id: { $ne: curr_id } }).select("-password").select("-email");
    res.status(200).json(searchUsers);
});


module.exports = router;