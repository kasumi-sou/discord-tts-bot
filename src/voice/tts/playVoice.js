"use strict";

const { createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, entersState, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
const { guild: guildData } = require("../../data");
const { LockObj, lock } = require("@mtripg6666tdr/async-lock");
const { log } = require("../../debug");
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
  const id = Date.now();
  log(`executed: play(${id})`);
  await lock(getLockerByGuildId(guildId), async () => {
    log(`executed: lock(${id})`);
    const connection = getVoiceConnection(guildId);
    if (!connection) { return log("no connection"); }
    log(`connection.state.status = ${connection.state.status}`);

    let player = null;

    if (guildData.get(guildId).player) {
      // すでにプレイヤーを生成済みの場合は新たに生成せずに再利用
      player = guildData.get(guildId).player;
      log(`executed: guildData.get(${guildId})`);
    }
    else {
      // const resource = createAudioResource(AudioResource, { inputType: StreamType.Arbitrary });
      player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Stop,
        },
      });
      log("executed: createAudioPlayer");

      player.on("error", (error) => {
        console.error(`AudioPlayer error (guild: ${guildId}):`, error);
      });
      player.on("stateChange", (oldState, newState) => {
        log(`player stateChange (guild: ${guildId}): ${oldState.status} -> ${newState.status}`);
      });
      connection.on("stateChange", (oldState, newState) => {
        log(`connection stateChange (guild: ${guildId}): ${oldState.status} -> ${newState.status}`);
      });

      // プレイヤーがない場合は作成
      const subscription = connection.subscribe(player);
      log(`executed: connection.subscribe (success: ${Boolean(subscription)})`);
      // Mapにプレイヤーをセット
      guildData.set(guildId, { player });

      log(`executed: guildData.set(${guildId})`);
    }

    audioResource.playStream.on("error", (error) => {
      console.error(`AudioResource stream error (guild: ${guildId}):`, error);
    });

    player.play(audioResource);
    log("executed: player.play");

    const abortController = new AbortController();

    // eslint-disable-next-line no-inline-comments
    await Promise.race([entersState(player, AudioPlayerStatus.Idle, 60000 /* 」1分*/ * 60/* 」60分 */), entersState(connection, VoiceConnectionStatus.Destroyed, abortController.signal)]);
    abortController.abort();
    log("executed: abortController.abort");
  });
};