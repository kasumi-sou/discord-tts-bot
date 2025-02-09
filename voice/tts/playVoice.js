const { createAudioResource, StreamType, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection } = require("@discordjs/voice");

module.exports = function play(filePath, guildId) {
	const connection = getVoiceConnection(guildId);
	const resource = createAudioResource(filePath, { inputType: StreamType.Arbitrary });
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});
	connection.subscribe(player);
	player.play(resource);
};