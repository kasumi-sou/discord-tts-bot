"use strict";

const { Events } = require("discord.js");

const { guild: guildData } = require("../data");
const { user: userData } = require("../data");

const { default: axios } = require("axios");
const rpcVoiceVox = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const rpcAivis = axios.create({ baseURL: "http://localhost:10101", proxy: false });

const { playText } = require("../voice/tts");
const { getVoiceConnection } = require("@discordjs/voice");

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
    const textChannelId = guildData.get(guildId)?.channel;
    const textChannel = oldState.client.channels.resolve(textChannelId);
    if ((oldState.channelId !== newState.channelId) && (newState.id !== oldState.client.user.id)) {
      const vcChannel = newState.guild.members.me.voice.channel;
      if (!vcChannel) {return;}
      if (newState.channelId === vcChannel.id) {
        await playText(`${newState.member.displayName}が${vcChannel.name}に参加しました`, guildId);

        // 参加者のボイスモデルを読み込み
        const styleId = userData.get(newState.member.id)?.style;
        if (!styleId) {return;};
        // console.log(styleId);
        const styleIdDigit = styleId.toString().length;

        if (styleIdDigit <= 2) {
          await rpcVoiceVox.post(`initialize_speaker?speaker=${styleId}&skip_reinit=true`, {
            headers: { "accept": "application/json" },
          });
        }
        else {
          await rpcAivis.post(`initialize_speaker?speaker=${styleId}&skip_reinit=true`, {
            headers: { "accept": "application/json" },
          });
        }
        console.log(`model loaded ${styleId}`);
      }
      else if (oldState.channelId === vcChannel.id) {
        const memberCount = () => oldState.channel.members.size;
        if (memberCount() === 1) {
          await textChannel.send(`:lying_face: **${vcChannel.name}** から誰もいなくなりました。5分後に自動で退出します。`);
          setTimeout(async () => {
            if (memberCount() > 1) {
              return;
            }
            else {
              const connection = getVoiceConnection(guildId);
              await textChannel.send(`:wave: **${vcChannel.name}** から誰もいなくなってから5分経過したため退出しました。`);
              guildData.set(guildId, { channel: null, player: null });
              connection?.destroy();
            }
            // eslint-disable-next-line no-inline-comments
          }, 1000 * 60 /* 」1分*/ * 5 /* 」5分*/);

        }
        else {
          await playText(`${oldState.member.displayName}が${vcChannel.name}から退出しました`, guildId);
        }
      }
    }
    if (oldState.channel && !newState.channel) {
      const connectedChannelNameOld = oldState.channel.name;
      if (newState.id !== oldState.client.user.id) return;
      if (!newState.channelId) {
        if (guildData.get(guildId)?.channel) {
          await textChannel.send(`:pleading_face:  **${connectedChannelNameOld}** から強制的に切断されました。`);
          guildData.set(guildId, { channel: null, player: null });
        }
      }
    }
  },
};