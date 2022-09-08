const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

//route pour se connecter

router.post("/login", async (req, res) => {
  try {
    const userConnect = await User.findOne({ email: req.body.email });
    if (userConnect) {
      const newHash = SHA256(req.body.password + userConnect.salt).toString(
        encBase64
      );
      if (newHash === userConnect.hash) {
        res.json({
          token: userConnect.token,
        });
      } else {
        res.status(401).json({ message: "Non autoriser" });
      }
    } else {
      res.status(401).json({ message: "Non autoriser" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
