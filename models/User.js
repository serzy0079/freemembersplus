const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  coins: {
    type: Number,
    default: 0,
  },
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
  lastServerJoined: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;