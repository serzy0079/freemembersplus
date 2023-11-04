const config = require("../config");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "help",
    description: "Display the bot's help page.",
  },

  async exe(client, interaction) {   
     const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .setDescription(`[Welcome to FreeMembers+](https://freemembersplus.gg/)\n\nThanks for using our bot!\n\nThe main purpose of this bot is to help grow your community!\nThis system allows you to buy member(s) to be able to develop your community with real people.\n\nYou can find more information about the system on our support server (link below).`)
      .addFields(
		{ name: "How to use the bot?", value: `It's very easy ! Simply use the \`/farm\` command to be able to collect money from the bot, then add the bot to your server and run the \`/buy\` command.` },
		{ name: "Need help ? Contact us on the support server", value: `${config.supportGuild}` },
	)
      .setImage(config.imageBot)
      .setColor(config.color.default);

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
};