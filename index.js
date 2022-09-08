const express = require("express");
require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("./models/User");
const { Router } = require("express");

const app = express();
app.use(cors());
app.use(express.json());

//route pour créer un compte
app.post("/register", async (req, res) => {
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

//route pour se connecter

app.post("/login", async (req, res) => {
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

//route pour récuperer la liste des utilisateur

app.get("/users", async (req, res) => {
  try {
    const listOfUser = await User.find();
    const response = [];
    listOfUser.map((user) => {
      const userObject = { email: user.email, name: user.name };
      response.push(userObject);
    });
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(400).json("not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
