const {SlashCommandBuilder} = require("discord.js");
const fs = require('node:fs');
const usersPath = 'users.json';

//maybe convert to enum?
//TODO: get this as keys from expansions.json
const allMods = ["poland-pack", "australia-pack", "persia-and-macedon-pack", "nubia-pack", "khmer-and-indonesia-pack", "rise-and-fall", "gathering-storm", "new-frontier-pass", "julius-caesar-pack"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mods')
        .setDescription('Enter information about your expansions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add new expansions')
                .addStringOption(option =>
                    option
                        .setName('mods')
                        .setDescription('Mods to add')
                        .setRequired(true)
                        .addChoices(
                            {name: 'All', value: 'all'},
                            {name: 'Poland Pack', value: 'poland-pack'},
                            {name: 'Australia Pack', value: 'australia-pack'},
                            {name: 'Persia and Macedon Pack', value: 'persia-and-macedon-pack'},
                            {name: 'Nubia Pack', value: 'nubia-pack'},
                            {name: 'Khmer and Indonesia Pack', value: 'khmer-and-indonesia-pack'},
                            {name: 'Rise and Fall', value: 'rise-and-fall'},
                            {name: 'Gathering Storm', value: 'gathering-storm'},
                            {name: 'New Frontier Pass', value: 'new-frontier-pass'},
                            {name: 'Julius Caesar Pack', value: 'julius-caesar-pack'})))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove expansions from the draft')
                .addStringOption(option =>
                    option
                        .setName('mods')
                        .setDescription('Mods to remove')
                        .setRequired(true)
                        .addChoices(
                            {name: 'All', value: 'all'},
                            {name: 'Poland Pack', value: 'poland-pack'},
                            {name: 'Australia Pack', value: 'australia-pack'},
                            {name: 'Persia and Macedon Pack', value: 'persia-and-macedon-pack'},
                            {name: 'Nubia Pack', value: 'nubia-pack'},
                            {name: 'Khmer and Indonesia Pack', value: 'khmer-and-indonesia-pack'},
                            {name: 'Rise and Fall', value: 'rise-and-fall'},
                            {name: 'Gathering Storm', value: 'gathering-storm'},
                            {name: 'New Frontier Pass', value: 'new-frontier-pass'},
                            {name: 'Julius Caesar Pack', value: 'julius-caesar-pack'}))),
    execute: async function (interaction) {
        const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

        const subcommand = interaction.options.getSubcommand(true);
        if (subcommand === 'add') {
            if (!users.some(i => i.id === interaction.user.id)) {
                users.push(new UserExpansions(interaction.user.id))
            }

            let option = interaction.options.getString('mods');

            if (option === 'all') {
                users[getIndexById(users, interaction.user.id)].mods = allMods;
            } else {
                users[getIndexById(users, interaction.user.id)].mods.push(option);
            }

            const expansions = require('../expansions.json');
            interaction.editReply(`Added ${(option === 'all' ? "all" : expansions[option])} in your mods pool`);
        } else {
            if (!users.some(i => i.id === interaction.user.id)) {
                interaction.editReply("I don't track the list of your mods right now. Try add some via \`/mods add\`")
                return;
            }

            let option = interaction.options.getString('mods');

            if (option === 'all') {
                users[getIndexById(users, interaction.user.id)].mods = [];
            } else {
                users[getIndexById(users, interaction.user.id)].mods = users[getIndexById(users, interaction.user.id)].mods.filter(function (value) {
                    return value !== option;
                })
            }

            const expansions = require('../expansions.json');
            interaction.editReply(`Removed ${(option === 'all' ? "all" : expansions[option])} from your mods pool`);
        }

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    }
};

class UserExpansions {
    id;
    mods = [];

    constructor(id) {
        this.id = id;
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