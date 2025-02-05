const { Events } = require("discord.js");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.author.bot) {
			return;
		}
		const soundPath = `../sounds/${message.author.id}.wav`;
		let voice = VoiceMap.get(message.author.id);
		if (!voice) {
			voice = default_voice;
		}
	},
};