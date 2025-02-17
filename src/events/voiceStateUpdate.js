const { Events } = require("discord.js");
const { guild: guildData } = require("../data");
const { playText } = require("../voice/tts");

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,

	/**
   * @param {import("discord.js").VoiceState} oldState
   * @param {import("discord.js").VoiceState} newState
   * @returns {Promise<void>}
   */

	async execute(oldState, newState) {
		const guildId = oldState.guild.id;
		const textChannelId = guildData.get(guildId);
		const textChannel = oldState.client.channels.resolve(textChannelId);
		if ((oldState.channelId !== newState.channelId) && (newState.id !== oldState.client.user.id)) {
			const vcChannel = newState.guild.members.me.voice.channel;
			if (!vcChannel) {return;}
			if (newState.channelId === vcChannel.id) {
				await playText(`${newState.member.displayName}が${vcChannel.name}に参加しました！`, guildId);
			}
			else if (oldState.channelId === vcChannel.id) {
				await playText(`${oldState.member.displayName}が${vcChannel.name}から退出しました！`, guildId);
			}
		}
		if (oldState.channel && !newState.channel) {
			const connectedChannelNameOld = oldState.channel.name;
			if (newState.id !== oldState.client.user.id) return;
			if (!newState.channelId) {
				if (guildData.has(guildId)) {
					await textChannel.send(`:pleading_face:  **${connectedChannelNameOld}** から強制的に切断されました`);
					guildData.delete(guildId);
				}
			}
		}
	},
};