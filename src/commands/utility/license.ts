"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { version } = require("../../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("license")
    .setDescription("本botの利用規約を表示します。"),
  async execute(interaction) {
    const license = new EmbedBuilder()
      .setColor(0xffdbed)
      .setTitle("利用規約")
      .setDescription("本bot自体の利用規約は以下の利用規約に従うものとします。\nまた、本botを利用開始した時点で前述の利用規約に同意したものとします。")
      .addFields(
        { name: "VoiceVox 利用規約", value: "https://voicevox.hiroshiba.jp/term/" },
        { name: "Aivis Project 利用規約", value: "https://jpchain.co.jp/news/2024-11-19-aivisproject-terms/" },
        { name: "AivisSpeech Engine 利用規約", value: "https://github.com/Aivis-Project/AivisSpeech-Engine?tab=LGPL-3.0-1-ov-file" },
        { name: "Aivis Common Model License (ACML) 1.0", value: "https://github.com/Aivis-Project/ACML/blob/master/ACML-1.0.md" },
        { name: "Aivis Common Model License (ACML) - Non Commercial 1.0", value: "https://github.com/Aivis-Project/ACML/blob/master/ACML-NC-1.0.md" },
        { name: "\n", value: "AivisSpeechを利用の際は当該モデルが`ACML 1.0`, `ACML-NC 1.0`のどちらに当てはまるか確認の上ご利用ください。" },
      )
      .setFooter({ text: `${interaction.guild.members.me.displayName} / version: ${version}`, iconURL: interaction.guild.members.me.displayAvatarURL() });
    await interaction.reply({ embeds: [license] });
  },
};