const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.author.bot) {
			return;
		}
		const connection = getVoiceConnection(message.guildId);
		const soundPath = `../sounds/${message.author.id}.wav`;
		const default_voice = "6";
		const VoiceMap = new Map;
		if (connection) {
			let voice = VoiceMap.get(message.author.id);
			if (!voice) {
				voice = default_voice;
			}
			// const convMessage = convertMessage(message.cleanContent);
			const convMessage = message;
			// await generateAudio(convMessage, soundPath, voice);
			// await play(convMessage, soundPath);
			console.log(message.cleanContent);
		}
		else if (!connection) { return; }
		else { console.error("An unexpected error occurred."); }
	},
};