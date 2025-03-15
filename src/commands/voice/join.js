"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

// botのギルドデータ取得
const { guild: guildData } = require("../../data");
const { user: userData } = require("../../data");

const { default: axios } = require("axios");
const rpcVoiceVox = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const rpcAivis = axios.create({ baseURL: "http://localhost:10101", proxy: false });

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("VCに参加します。"),
  async execute(interaction) {
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.member.id);

    // コマンド実行者の参加しているボイスチャンネル取得
    const channel = member.voice.channel;
    // botの参加しているボイスチャンネル取得
    const connectedChannel = interaction.guild.members.me.voice.channel;
    if (!channel) {
      // コマンド実行者がボイスチャンネルに参加していない場合
      return interaction.reply(":cold_sweat: ボイスチャンネルに参加してから実行してください。");
    }
    else if (connectedChannel) {
      // すでにbotがボイスチャンネルに参加している場合
      return interaction.reply(`:shaking_face: 既に **${connectedChannel.name}** に参加しています。`);
    }
    else if (!connectedChannel) {
      // botがすでにボイスチャンネル参加しておらず、実行者がボイスチャンネルにいる場合 接続処理
      joinVoiceChannel({
        guildId: guild.id,
        channelId: channel.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfMute: false,
      });
      await interaction.reply(`:partying_face: **${channel.name}** に参加しました！`);
      // ギルドデータに接続済ボイスチャンネルidをセット
      guildData.set(guild.id, { channel: interaction.channelId });

      // すでに参加済みのメンバーのボイスモデルをロード

      const members = channel.members;

      members.forEach(async item => {

        // ボイスチャンネルに参加済みのメンバーidと対応するstyleIdの取得
        const memberId = item.user.id;
        const styleId = userData.get(memberId)?.style;

        if (!styleId) {return;};

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
      });

    }
    else {
      // エラー処理
      await interaction.reply("An unexpected error occurred.");
      console.error("An unexpected error occurred.");
      return;
    }
  },
};