const {Events} = require('discord.js');

module.exports = {
    register(client) {
        client.once(Events.ClientReady, (client) => this.execute(client));
    },
    async execute(client) {
        console.log(`[${new Date().toUTCString()}] Logged in as ${client.user.tag}`);
    }
};