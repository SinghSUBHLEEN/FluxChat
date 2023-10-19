const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*  Middlewares */
// router.use(express.json());
// router.use(cookieParser());
// router.use(express.static(__dirname + '/client/public/build'));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("*", async (req, res) => {
  const options = {
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  }
  res.cookie('gotResponse', { id: '1' }, options).send("<h1>Hello, Cookie sent</h1>");
});

module.exports = router;
