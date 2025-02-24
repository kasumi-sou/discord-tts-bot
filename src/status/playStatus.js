"use strict";

const { Events, ActivityType } = require("discord.js");
const { setTimeout: sleep } = require("timers/promises");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		while (true) {

			await client.user.setActivity({
				name: "✅ /joinで参加",
				type: ActivityType.Custom,
			});
			await sleep(10000);

			await client.user.setActivity({
				name: "🎉 v0.2.0! 新機能は/helpから",
				type: ActivityType.Custom,
			});
			await sleep(10000);

			await client.user.setActivity({
				name: "✅ オープンソースbot",
				type: ActivityType.Custom,
			});
			await sleep(10000);
		}
	},
};
