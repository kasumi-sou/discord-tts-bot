"use strict";

const { SlashCommandBuilder, Events, MessageFlags } = require("discord.js");
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
      return interaction.reply({ content: ":cold_sweat: ボイスチャンネルに参加してから実行してください。", flags: MessageFlags.Ephemeral });
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

      let isVoiceVoxAvailable = true;
      let isAivisAvailable = true;

      await Promise.all(members.map(async item => {

        // ボイスチャンネルに参加済みのメンバーidと対応するstyleIdの取得
        const memberId = item.user.id;
        const styleId = userData.get(memberId)?.style || 6;

        // styleIdの桁数でvoicevoxとaivisの判別
        const styleIdDigit = styleId.toString().length;

        if (styleIdDigit <= 2) {
          try {
            await rpcVoiceVox.post(`initialize_speaker?speaker=${styleId}&skip_reinit=true`, {
              headers: { "accept": "application/json" },
            });
            console.log(`model loaded ${styleId}`);
          }
          catch (e) {
            console.error(e);
            isVoiceVoxAvailable = false;
          }

        }
        else {
          try {
            await rpcAivis.post(`initialize_speaker?speaker=${styleId}&skip_reinit=true`, {
              headers: { "accept": "application/json" },
            });
            console.log(`model loaded ${styleId}`);
          }
          catch (e) {
            console.error(e);
            isAivisAvailable = false;
          }
        }
      }));

      if (!isVoiceVoxAvailable) {
        await interaction.channel.send(":warning: VOICEVOX読み上げは現在利用できません。管理者に連絡してください。");
      }
      if (!isAivisAvailable) {
        await interaction.channel.send(":warning: AivisSpeech読み上げは現在利用できません。管理者に連絡してください。");
      }

    }
    else {
      // エラー処理
      await interaction.reply("An unexpected error occurred.");
      console.error("An unexpected error occurred.");
      return;
    }
  },
};