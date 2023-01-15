const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const uuid = require('node:crypto')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Create and manage games')
        .addSubcommand(option => option.setName('create')
                                       .setDescription('Create a new game')),
    execute: async function (interaction) {
        const gameId = uuid.randomUUID();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('join')
                    .setLabel('Join')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('leave')
                    .setLabel('Leave')
                    .setStyle(ButtonStyle.Secondary)
            );

        interaction.editReply({content: `Created new game with id ${gameId}!`, components: [row]})
    }
};