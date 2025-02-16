const { Events } = require("discord.js");
const { guild } = require("../data");

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState) {
		/* if (oldState.channel = false && ) {

    }*/
		if (oldState.channel && !newState.channel) {
			const guildId = oldState.guild.id;
			const textChannelId = guild.get(guildId);
			const textChannel = oldState.client.channels.resolve(textChannelId);
			const connectedChannelNameOld = oldState.channel.name;
			if (newState.id !== oldState.client.user.id) return;
			if (!newState.channelId) {
				if (guild.has(guildId)) {
					await textChannel.send(`:pleading_face:  **${connectedChannelNameOld}** から強制的に切断されました`);
					guild.delete(guildId);
				}
			}
		}
	},
};