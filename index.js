const express = require("express");
require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const { Router } = require("express");

const app = express();
app.use(cors());
app.use(express.json());

// import des routes
const signup = require("./routes/Signup");
app.use(signup);

const login = require("./routes/login");
app.use(login);

const users = require("./routes/users");
app.use(users);

app.all("*", (req, res) => {
  res.status(400).json("not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
