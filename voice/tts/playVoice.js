const { createAudioResource, StreamType, createAudioPlayer } = require("@discordjs/voice");

module.exports = function play(filePath) {
	const resource = createAudioResource(filePath, { inputType: StreamType.Arbitrary });
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: noSubscriber.Pause,
		},
	});
	player.play(resource);
};