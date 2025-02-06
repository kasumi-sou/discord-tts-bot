const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		try {
			console.log(`Ready! Logged in as ${client.user.tag}`);
		}
		catch (e) {console.error(e);}
	},
};