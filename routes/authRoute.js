const express = require("express");
const router = express.Router();


router.post('/login', async (req, res) => {
    const { email, password, rem } = req.body;
    console.log(req.body);
    res.status(201).json({ message: "hello" });
})

router.post('/register', async (req, res) => {
    console.log(req.body);
    res.status(201).json({ message: "hello" });
})

module.exports = router;