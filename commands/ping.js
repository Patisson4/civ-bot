const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async function (interaction) {
        const sent = await interaction.editReply({content: 'Pinging...', fetchReply: true});
        await interaction.editReply(`Round trip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    }
};