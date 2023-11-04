const { EmbedBuilder } = require("discord.js");
const config = require("../config");
const User = require("../models/User");
const Guild = require("../models/Guild");

module.exports = {
  data: {
    name: "buy",
    description: "Buy members.",
    options: [
      {
        type: 4,
        name: "amount",
        required: true,
        description: "Number of members to buy.",
      },
      {
        type: 7,
        name: "channel",
        required: true,
        description: "Channel where the server's invitation will be created.",
      },
    ],
  },

  async exe(client, interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger("amount");
    const channelId = interaction.options.getChannel("channel").id;

    if (isNaN(amount)) {
      await interaction.reply("The amount must be a valid number.");
      return;
    }

    try {
      const user = await User.findOne({ userId });

      if (user) {
        if (user.coins < amount) {
          await interaction.reply("You do not have enough coins to buy this amount of members.");
        } else {
          const serverId = interaction.guild.id;
          const serverName = interaction.guild.name;
          const guild = new Guild({
            guildId: serverId,
            nameGuild: serverName,
            membersBought: amount,
            inviteLink: null,
            lastMemberJoined: userId,
          });

          user.coins -= amount;
          await user.save();

          const invite = await interaction.guild.channels.cache
            .get(channelId)
            .createInvite({ maxAge: 0 });

          guild.inviteLink = invite.code;
          guild.save();
          
          const buyEmbed = new EmbedBuilder()
          .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
          .setDescription(`You will get **${amount} members** as soon as possible on your server.\nYou can follow the progress with \`/info\`!`)
          .setImage(config.imageBot)
          .setColor(config.color.default);

          await interaction.reply({ embeds: [buyEmbed] });
        }
      } else {
        await interaction.reply("You are not registered in our system. Use the bot to be registered.");
      }
    } catch (error) {
      console.error("Error when purchasing members:", error);
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
    }
  },
};