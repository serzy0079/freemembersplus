const config = require("../config");
const Guild = require("../models/Guild");
const User = require("../models/User");

module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    const guildId = member.guild.id;

    try {
        const guildData = await Guild.findOne({ guildId });

        if (guildData) {
            if (guildData.lastMemberJoined.includes(member.id)) {
                const user = await User.findOne({ userId: member.id });

                if (user) {
                    user.coins -= 2;
                    await user.save();
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
  }
};