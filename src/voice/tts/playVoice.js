const { createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, entersState, AudioPlayerStatus } = require("@discordjs/voice");
const { LockObj, lock } = require("@mtripg6666tdr/async-lock");
// const locker = new LockObj();
const guildLocker = new Map();
function getLockerByGuildId(guildId) {
	if (guildLocker.has(guildId)) {
		return guildLocker.get(guildId);
	}
	else {
		const locker = new LockObj;
		guildLocker.set(guildId, locker);
		return locker;
	}
}
module.exports = async function play(audioResource, guildId) {
	await lock(getLockerByGuildId(guildId), async () => {
		const connection = getVoiceConnection(guildId);
		if (!connection) { return; }
		// const resource = createAudioResource(AudioResource, { inputType: StreamType.Arbitrary });
		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});
		connection.subscribe(player);
		player.play(audioResource);
		// eslint-disable-next-line no-inline-comments
		await entersState(player, AudioPlayerStatus.Idle, 60000 /* 」1分*/ * 60/* 」60分 */);
	});
};