const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const reply = require("../reply/");
// const readMessages = require("../voice/tts/readMessages");
const playAudio = require("../voice/tts/");
const { guild } = require("../data");

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
			if (!connection || !guild.has(message.guildId)) { return; }
			else if (connection) {
				if (message.channel.id === guild.get(message.guildId)) {
					if (message.content.startsWith("'")) {
						return;
					}
				  await playAudio(message);
				}
			}
			else { console.error("An unexpected error occurred."); }
		}
		catch (e) {console.error(e);};
	},
};