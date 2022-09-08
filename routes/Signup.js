const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

//route pour créer un compte
router.post("/register", async (req, res) => {
  try {
    if (req.body.email && req.body.name && req.body.password) {
      const isUserExisting = await User.findOne({
        email: req.body.email,
      });
      if (isUserExisting) {
        res.status(409).json({ message: "cet email a déjà un compte" });
      } else {
        const salt = uid2(16);
        const hash = SHA256(req.body.password + salt).toString(encBase64);
        const token = uid2(32);
        const newUser = new User({
          email: req.body.email,
          name: req.body.name,
          token: token,
          salt: salt,
          hash: hash,
        });

        await newUser.save();
        res.json({
          email: newUser.email,
          name: newUser.name,
          token: newUser.token,
        });
      }
    } else {
      res.status(400).json({ message: " Merci de remplir tout les champs" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
