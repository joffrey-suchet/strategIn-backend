const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  name: String,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
