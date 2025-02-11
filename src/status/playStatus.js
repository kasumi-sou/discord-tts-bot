const { Events, ActivityType } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setActivity("お昼寝", { type: ActivityType.Competing });
	},
};