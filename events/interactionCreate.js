const {Events} = require('discord.js');

module.exports = {
    register: function (client) {
        client.on(Events.InteractionCreate, async (interaction) => {
            console.log(`[${interaction.createdAt.toUTCString()}] Called interaction ${typeof interaction} was called by ${interaction.user.tag} from ${interaction.guild.name}`)
            if (interaction.isChatInputCommand()) {
                await executeChatInputInteraction(interaction)
            }
            else if (interaction.isButton()) {
                await executeButtonInteraction(interaction)
            } else {
                console.log(`[${interaction.createdAt.toUTCString()}] Called interaction ${typeof interaction} was called by ${interaction.user.tag} from ${interaction.guild.name}`)
            }
        });
    }
};


async function executeChatInputInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply(`No command matching ${interaction.commandName} was found.`);
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand(false);
        let fullCommand = interaction.commandName;
        if (subcommand) {
            fullCommand += ':' + subcommand;
        }

        console.log(`[${interaction.createdAt.toUTCString()}] ${fullCommand} was called by ${interaction.user.tag} from ${interaction.guild.name}`)
        await command.execute(interaction);
    } catch (error) {
        await interaction.editReply('Something went wrong :(');
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
    }
}

async function executeButtonInteraction(interaction) {
    const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.customId === 'join', time: 15000 });

    // const games = require('../games.json')
    console.log(interaction.message.id);

    collector.on('collect', async i => {
        await i.update({ content: 'A button was clicked!', components: interaction.components });
    });
}