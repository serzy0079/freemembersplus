const { Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const config = require("../config");
const Discord = require("discord.js");
const User = require("../models/User");

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const { exe } = require(`../commands/${interaction.commandName}`);
            
            const userId = interaction.user.id;
            const user = await User.findOne({ userId });

            if (user) {
                if (user.isBlacklisted) {
                    const blacklistEmbed = new EmbedBuilder()
                    .setDescription(`<:warning:1168144663539097731> Oh no.. I just noticed that a **administrator** of the FreeMembers+ team has blacklisted you from the system.\n\nDo you think it's a mistake on our part? I invite you to join the [FreeMembers+ unban](${config.unbanGuild}) server.`)
                    .setImage(config.imageBot)
                    .setColor(config.color.red);
                    interaction.reply({ embeds: [blacklistEmbed], ephemeral: true });
                } else {
                    exe(client, interaction);
                }
            } else {
                const newUser = new User({ userId });
                await newUser.save();
                const welcomeEmbed = new EmbedBuilder()
                .setDescription(`<:bookmarktabs:1168165501428572270> Hey <@${interaction.user.id}>, you now have an account registered in our database!\n\n__Why did I receive this message? __\nYou received this message because you do not have an account registered in the database.`)
                .setImage(config.imageBot)
                .setColor(config.color.default);
                interaction.reply({ embeds: [welcomeEmbed], ephemeral: true }).then(() => {
                    exe(client, interaction);
                });
            }
        }
    }
};