const config = require("../config");
const User = require("../models/User");

module.exports = {
  data: {
    name: "blacklist",
    description: "Blacklist a user (owner).",
    options: [
      {
        type: 6,
        name: "user",
        required: true,
        description: "The user to blacklist or unblacklist.",
      },
      {
        type: 5,
        name: "status",
        required: true,
        description: "True = enabled / False = disabled.",
      },
    ],
  },

  async exe(client, interaction) {
    const ownerId = config.ownersId;
    const userIdToBlacklist = interaction.options.getUser("user").id;
    const newStatus = interaction.options.getBoolean("status");
    
    if (interaction.user.id !== ownerId) {
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
      return;
    }

    try {
      const userToUpdate = await User.findOne({ userId: userIdToBlacklist });

      if (userToUpdate) {
        userToUpdate.isBlacklisted = newStatus;
        await userToUpdate.save();

        await interaction.reply(`Update data <@${userIdToBlacklist}>.`);
      } else {
        await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
      }
    } catch (error) {
      console.error("Error:", error);
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
    }
  },
};