const express = require("express");
const router = express.Router();

const User = require("../models/User");

//route pour récuperer la liste des utilisateur

router.get("/users", async (req, res) => {
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

module.exports = router;
