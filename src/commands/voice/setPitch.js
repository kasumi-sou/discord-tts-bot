"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("set_pitch")
    .setDescription("全体の音高を設定します")
    .addNumberOption((option) => (
      option
        .setName("pitch")
        .setNameLocalizations({
          ja: "音高",
        })
        .setDescription("-3 ~ 3 の間で指定してください(デフォルト値: 0 )")
        .setMinValue(-3)
        .setMaxValue(3)
        .setRequired(true)
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    const pitch = interaction.options.getNumber("pitch");

    const memberId = interaction.member.id;
    // ユーザーデータに保存
    userData.set(memberId, { pitch });
    await interaction.reply(`:white_check_mark: 全体の音高を **${pitch}** に設定しました！`);
  },
};