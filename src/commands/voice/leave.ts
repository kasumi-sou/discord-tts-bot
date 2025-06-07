"use strict";

const { SlashCommandBuilder, Events, MessageFlags } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
// botのギルドデータ取得
const { guild: guildData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("VCから退出します。"),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guildId);
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.member.id);
    // コマンド実行者の参加しているボイスチャンネル取得
    const channel = member.voice.channel;
    // botの参加しているボイスチャンネル取得
    const connectedChannel = interaction.guild.members.me.voice.channel;

    if (!channel) {
      // コマンド実行者がボイスチャンネルにいない場合
      return interaction.reply({ content: ":cold_sweat: ボイスチャンネルに参加してから実行してください。", flags: MessageFlags.Ephemeral });
    }
    else if (!connection || !guildData.get(guild.id)?.channel) {
      // すでにbotがボイスチャンネルに参加している場合
      return interaction.reply(":thinking: BOTは現在VCに参加していません。");
    }
    else if (connection) {
      // 切断処理
      // ギルドデータにの接続済ボイスチャンネルをnullにセット
      guildData.set(guild.id, { channel: null, player: null });
      // 接続破棄
      connection?.destroy();
      interaction.reply(`:wave: **${connectedChannel.name}** から切断しました!`);
    }
    else {
      // エラー処理
      await interaction.reply("An unexpected error occurred.");
      console.error("An unexpected error occurred.");
    }
  },
};