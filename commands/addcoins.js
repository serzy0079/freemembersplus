const config = require("../config");
const User = require("../models/User");

module.exports = {
  data: {
    name: "addcoins",
    description: "Give coins to a user (owner).",
    options: [
      {
        type: 6,
        name: "user",
        required: true,
        description: "The user to give coins to.",
      },
      {
        type: 4,
        name: "amount",
        required: true,
        description: "Number of coins to give to the user.",
      },
    ],
  },

  async exe(client, interaction) {
    const ownerId = config.ownersId;
    const userIdToAddCoins = interaction.options.getUser("user").id;
    const amountToAdd = interaction.options.getInteger("amount");

    if (interaction.user.id !== ownerId) {
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
      return;
    }

    try {
      const userToUpdate = await User.findOne({ userId: userIdToAddCoins });

      if (userToUpdate) {
        userToUpdate.coins += amountToAdd;
        await userToUpdate.save();

        await interaction.reply(`Add ${amountToAdd} coin(s) to <@${userIdToAddCoins}>.`);
      } else {
        await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
      }
    } catch (error) {
      console.error("Error:", error);
      await interaction.reply(`<:warning:1168144663539097731> **Whoops!** Something went wrong; this command has timed out. *If you see this message, please file a bug report on our Discord server.*\n\`\`\`prolog\nINTERACTION ID: ${interaction.user.id}\nINTERACTION_INIT_ID: 1\n\`\`\``);
    }
  },
};