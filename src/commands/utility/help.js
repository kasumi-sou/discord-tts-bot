"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { version } = require("../../../package.json");
const updateEmbed = require("../../../utils/updateEmbed");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("ヘルプを表示します。"),
  async execute(interaction) {
    const help = new EmbedBuilder()
      .setColor(0xffdbed)
      .setTitle("Discord-TTS-Bot")
      .setURL("https://github.com/kasumi-sou/discord-tts-bot")
      .setDescription("オープンソースのdiscord.js製の読み上げBOTです。\n読み上げにはVOICEVOX及びAivisSpeechを使用しています。\n利用可能なコマンドを確認するには `/command` を使用してください。\n不具合が発生した場合github上でissueを作成していただけると助かります。")
      .addFields(
        { name: "\n", value: "\n" },
        { name: "ソースコード", value: "https://github.com/kasumi-sou/discord-tts-bot" },
        { name: "制作者", value: "https://github.com/kasumi-sou" },
        { name: "VoiceVox公式サイト", value: "https://voicevox.hiroshiba.jp/" },
        { name: "AivisSpeech公式サイト", value: "https://aivis-project.com/#products-aivisspeech" },
        { name: "\n", value: "また、bot利用前に`/license`から**必ず**利用規約をご確認ください。" },
      )
      .setFooter({ text: `${interaction.guild.members.me.displayName} / version: ${version}`, iconURL: interaction.guild.members.me.displayAvatarURL() });

    const unixNowTime = Date.now();
    const expTime = new Date("2025/2/27 0:00:00 GMT+9").getTime();

    // expTimeまではコマンド実行時に新機能エンベッドを追加
    if (unixNowTime > expTime) {
      await interaction.reply({ embeds: [help] });
    }
    else {
      const update = updateEmbed.setFooter({ text: `${interaction.guild.members.me.displayName} / version: ${version}`, iconURL: interaction.guild.members.me.displayAvatarURL() });
      await interaction.reply({ embeds: [help, update] });
    }
  },
};