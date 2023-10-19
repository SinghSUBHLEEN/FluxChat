const express = require('express');
const router = express.Router();


// send message
router.post("/", async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("No content or chatId provided");
        return res.status(400);
    }
})


// fetch all massages with a particular chat id
router.get('/:chatId', async (req, res) => {

})


module.exports = router;
