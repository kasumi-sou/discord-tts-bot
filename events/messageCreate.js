const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const owata = require("../reply/owata");
// const readMessages = require("../voice/tts/readMessages");
const playAudio = require("../voice/tts/");
const data = require("../data");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		try {
			if (message.author.bot) {
				return;
			}
			await owata(message);
			const connection = getVoiceConnection(message.guildId);
			if (!connection || !data.get(message.guildId)) { return; }
			else if (connection) {
				// await readMessages(message);
				await playAudio(message);
			}
			else { console.error("An unexpected error occurred."); }
		}
		catch (e) {console.error(e);};
	},
};