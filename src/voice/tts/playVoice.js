"use strict";

const { createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, entersState, AudioPlayerStatus } = require("@discordjs/voice");
const { guild: guildData } = require("../../data");
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

		let player = null;

		if (guildData.get(guildId).player) {
			// すでにプレイヤーを生成済みの場合は新たに生成せずに再利用
			player = guildData.get(guildId).player;
		}
		else {
			// const resource = createAudioResource(AudioResource, { inputType: StreamType.Arbitrary });
			player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});
			// プレイヤーがない場合は作成
			connection.subscribe(player);
			// Mapにプレイヤーをセット
			guildData.set(guildId, { player: player });
		}

		player.play(audioResource);

		// eslint-disable-next-line no-inline-comments
		await entersState(player, AudioPlayerStatus.Idle, 60000 /* 」1分*/ * 60/* 」60分 */);
	});
};