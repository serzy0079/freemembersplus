const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildId: {
    type: String,
    unique: true,
  },
  nameGuild: {
    type: String,
  },
  membersBought: {
    type: Number,
    default: 0,
  },
  inviteLink: {
    type: String,
  },
  lastMemberJoined: {
    type: [String],
    default: ["1164232016485683331"],
  },
});

const Guild = mongoose.model("Guild", guildSchema);

module.exports = Guild;