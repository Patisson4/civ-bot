const {SlashCommandBuilder} = require('discord.js');
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user')
        .addUserOption(option =>
            option.setName('user')
                  .setDescription('Specify user')),
    execute: async function (interaction) {
        const users = JSON.parse(fs.readFileSync('./users.json', "utf8"));
        const user = interaction.options.getUser('user') ?? interaction.user;
        const index = getIndexById(users, user.id)

        if (index === -1) {
            await interaction.editReply(`User not found`);
            return;
        }

        await interaction.editReply(`Your current mod pool:\n\`\`\`\n${users[getIndexById(users, user.id)].mods.join("\n")}\`\`\``);
    }
}

function getIndexById(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }

    return -1;
}