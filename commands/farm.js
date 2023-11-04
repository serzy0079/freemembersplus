const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const Guild = require('../models/Guild');

module.exports = {
  data: {
    name: 'farm',
    description: 'Collect coins by joining servers.',
  },

  async exe(client, interaction) {
    const userId = interaction.user.id;

    try {
      const userGuilds = await Guild.find();

      if (userGuilds.length === 0) {
      
        const noServer = new EmbedBuilder()
           .setDescription(`<:warning:1168144663539097731> There are no registered servers in the database.`)
           .setImage(config.imageBot)
           .setColor(config.color.red);
           
        await interaction.reply({ embeds: [noServer] });
        return;
      }

      const serversToShow = [];

      for (const guildData of userGuilds) {
        const server = client.guilds.cache.get(guildData.guildId);

        if (server && !server.members.cache.has(userId)) {
          serversToShow.push(guildData);
        }
      }

      if (serversToShow.length === 0) {
      
        const fullServer = new EmbedBuilder()
           .setDescription(`There is no longer a server available for you!\n\n<:wrappedgift:1169454010982473799> Don't you see any other servers? Join our [**support server**](${config.supportGuild}) to get more coins!`)
           .setImage(config.imageBot)
           .setColor(config.color.red);
           
        await interaction.reply({ embeds: [fullServer] });
        return;
      }

      const serverCount = Math.min(5, serversToShow.length);
      let farmMessage = 'Join one of the servers below ⬇️ to win **1 coins**.\n';

      for (let i = 0; i < serverCount; i++) {
        const guildData = serversToShow[i];
        farmMessage += `> Name: ${guildData.nameGuild}\n`;
        farmMessage += `> \`error/${guildData.membersBought}\`\n`;
        farmMessage += `> <:email:1169450056932409414> [**To join**](https://discord.gg/${guildData.inviteLink})\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle("<:tractor:1169450108237119528> Farm")
        .setDescription(farmMessage)
        .addFields({ name: '\u200B', value: `<:wrappedgift:1169454010982473799> Don't you see any other servers? Join our [**support server**](${config.supportGuild}) to get more coins!`, inline: true })
        .setImage(config.imageBot)
        .setColor(config.color.default);

      await interaction.reply({ content: `<:warning:1168144663539097731> Remember, you must stay **2 days** on the servers, otherwise you will lose **2 coins**! <:warning:1168144663539097731>`, embeds: [embed] });
    } catch (error) {
      console.error("Error when collecting servers:", error);
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
    }
  },
};