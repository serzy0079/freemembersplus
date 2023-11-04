const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require("../config");
const User = require("../models/User");

module.exports = {
  data: {
    name: "profile",
    description: "See your profile.",
  },

  async exe(client, interaction) {
    const userId = interaction.user.id;

    try {
      const user = await User.findOne({ userId });

      if (user) {
        const solde = user.coins;
        const isBlacklisted = user.isBlacklisted;
        const lastServerJoined = user.lastServerJoined;
        
        const profileEmbed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
        .setDescription(`> Solde: ${solde} coins\n> Blacklist: ${isBlacklisted ? "Yes" : "No"}\n> Last server joined: ${lastServerJoined || "None"}`)
        .setImage(config.imageBot)
        .setColor(config.color.default);

        await interaction.reply({ embeds: [profileEmbed] });
      } else {
        await interaction.reply("You are not registered in our system. Use the bot to be registered.");
      }
    } catch (error) {
      console.error("Error when retrieving the profile:", error);
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
    }
  },
};