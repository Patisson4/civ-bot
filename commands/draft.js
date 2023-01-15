const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('draft')
        .setDescription('Provides a leaders draft')
        .addIntegerOption(option => option.setName('players')
                                          .setDescription('Number of players in the game')
                                          .setRequired(true)
                                          .setMinValue(1))
        .addIntegerOption(option => option.setName('options')
                                          .setDescription('Number of options for each player; default value is 3')
                                          .setMinValue(1))
        .addBooleanOption(option => option.setName('dlc')
                                          .setDescription('Show required DLC'))
        .addIntegerOption(option => option.setName('breaks')
                                          .setDescription('Number of people per reply')
                                          .setMinValue(1)),
    execute: async function (interaction) {
        const players = interaction.options.getInteger('players', true);
        const options = interaction.options.getInteger('options', false) ?? 3;
        const breaks = interaction.options.getInteger('breaks', false);
        const showDlc = interaction.options.getBoolean('dlc', false);

        const leaders = require("../civilizations.json")
        const leadersNumber = players * options;

        if (leaders.length < leadersNumber) {
            await interaction.editReply(`Unable to provide draft: requested number of leaders should be equal or less than ${leaders.length}, actual was ${leadersNumber}`);
            return;
        }

        let maxCivIdent = 0;
        let maxLeadIdent = 0;
        for (let i = 0; i < leadersNumber; i++) {
            maxCivIdent = Math.max(maxCivIdent, leaders[i].civilization.length);
            maxLeadIdent = Math.max(maxLeadIdent, leaders[i].leader.length);
        }

        maxCivIdent += 4;
        maxLeadIdent += 4;

        shuffle(leaders);
        const picks = [];

        for (let i = 1, index = 0; i <= players; i++) {
            let pick = "";
            pick += `Player ${i}:\n`;
            for (let j = 0; j < options; j++, index++) {
                pick += leaders[index].civilization.padEnd(maxCivIdent, ' ');

                let leader = leaders[index].leader;
                if (showDlc) {
                    leader = leader.padEnd(maxLeadIdent, ' ');
                }

                pick += leader;

                if (showDlc && leaders[index].dlc) {
                    pick += `(${leaders[index].dlc})`
                }

                pick += '\n';
            }

            picks.push(pick)
        }

        await interaction.editReply('Ready! Picks are:');

        let reply = "```\n";
        for (let i = 0, count = 0; i < picks.length; i++, count++) {
            if (count === breaks || reply.length + picks[i].length >= 2000) {
                reply += "```";
                await interaction.followUp(reply);
                reply = "```\n";
                count = 0;
            }

            reply += picks[i] + '\n';
        }

        if (reply !== "") {
            reply += "```";
            await interaction.followUp(reply);
        }
    }
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}