const { createAudioResource, StreamType, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, entersState, AudioPlayerStatus } = require("@discordjs/voice");


module.exports = async function play(filePath, guildId) {
	const connection = getVoiceConnection(guildId);
	const resource = createAudioResource(filePath, { inputType: StreamType.Arbitrary });
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});
	connection.subscribe(player);
	player.play(resource);
	await entersState(player, AudioPlayerStatus.Idle, 30000);
};