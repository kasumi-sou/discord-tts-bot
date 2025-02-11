const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const reply = require("../reply/");
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
			await reply(message);
			const connection = getVoiceConnection(message.guildId);
			if (!connection || !data.has(message.guildId)) { return; }
			else if (connection) {
				if (message.channel.id === data.get(message.guildId)) {
				  await playAudio(message);
				}
			}
			else { console.error("An unexpected error occurred."); }
		}
		catch (e) {console.error(e);};
	},
};