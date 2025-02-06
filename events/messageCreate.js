const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const owata = require("../reply/owata");
const readMessages = require("../voice/tts/readMessages");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.author.bot) {
			return;
		}
		await owata(message);
		const connection = getVoiceConnection(message.guildId);
		if (connection) {
			await readMessages(message);
		}
		else if (!connection) { return; }
		else { console.error("An unexpected error occurred."); }
	},
};