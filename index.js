const { Client, Collection, GatewayIntentBits, WebhookClient, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("./config");
const inviteTracker = require("./inviteTracker");
const Guild = require("./models/Guild");
const User = require("./models/User");

const webhook = {
    url: "url webhook"
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  restTimeOffset: 0,
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MANAGE_GUILD", "MESSAGE", "REACTION"],
})

const tracker = new inviteTracker(client);

tracker.on("cacheFetched", (cache) => {
    console.log(`[INVITE-TRACKER] Cache fetched with ${cache.size} invites`);
});

tracker.on("guildMemberAdd", async (member, type, invite) => {
  if (type === "normal") {
    const guildId = member.guild.id;
    const inviteCode = invite.code;

    try {
      const guildData = await Guild.findOne({ guildId });

      if (guildData && guildData.inviteLink === inviteCode) {
        const user = await User.findOne({ userId: member.id });

        if (user) {
          if (!guildData.lastMemberJoined.includes(member.id)) {
            user.coins += 0.75;
            await user.save();

            guildData.lastMemberJoined.push(member.id);
            await guildData.save();

            new WebhookClient(webhook).send({
              content: `\`[EVENT]\` <@${member.id}> Just joined the ${member.guild.name} server.`,
            });

            if (guildData.membersBought > 0) {
              guildData.membersBought -= 1;
              await guildData.save();
            }

            if (guildData.membersBought === 0) {
              const guild = client.guilds.cache.get(guildData.guildId);
              if (guild) {
                guild.leave();
                const announcementChannel = guild.channels.cache.get('marche pas cetais un test');
                if (announcementChannel) {
                  const embed = new EmbedBuilder()
                    .setTitle("Publicité terminée")
                    .setDescription("Hey owner, votre publicité pour le serveur " + guildData.nameGuild + " est maintenant terminée. Vous pouvez recommander des membres en exécutant la commande `/buy` sur votre serveur.")
                    .setColor("#ff0000");
                  announcementChannel.send({ embeds: [embed] });
                }
              }
              await Guild.deleteOne({ guildId: guildId });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else if (type === "vanity") {
    new WebhookClient(webhook).send({
      content: `<@${member.id}> arrived using the personalized invitation.`,
    });
  } else if (type === "bot") {
    new WebhookClient(webhook).send({
      content: `<@${member.id}> has been just added.`,
    });
  } else if (type === "unknown") {
    new WebhookClient(webhook).send({
      content: `<@${member.id}> has just joined, but I can't find out who invited him.`,
    });
  }
});

client.commands = new Collection()

client.login(config.bot.token);

const eventFiles = readdirSync("./event").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
  const event = require(`./event/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args))
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args))
  }
}

process.on("unhandledRejection", (error) => {
  if (error.code == 10062) return; // Unknown interaction
  console.log(`[ERREUR] ${error}`);
})