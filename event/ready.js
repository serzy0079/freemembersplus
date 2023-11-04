const { REST, Routes, Client, ActivityType } = require("discord.js");
const config = require("../config");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[BOT] I am connected to ${client.user.tag}.`)
        
        //require("../app")(client);
        
        mongoose.connect("url mongodb", { useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`[MONGODB] I successfully logged in!`)

        client.user.setPresence({
            activities: [{ name: `/help | @me | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`, type: ActivityType.Watching }]
        });

        const commandsFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));
        for (const file of commandsFiles) {
            let { data } = require(`../commands/${file}`);
            data.name = file.replace(/\.[^.]*$/, "");
            client.application.commands.create(data).then(() => {
                console.log(`[SLASH] /${data.name} functional!`);
            }).catch(({ stack }) => {
                console.error(`[ERROR] The slash command "${data.name}" encountered an error:`, stack);
            });
        };
        
        const rest = new REST({ version: '10' }).setToken(config.bot.token);

        /*rest.put(Routes.applicationCommands(client.user.id), { body: [] })
            .then(() => console.log('I have removed all the slash commands!'))
            .catch(console.error);*/
    }
}