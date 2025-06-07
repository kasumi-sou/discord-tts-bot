"use strict";

const { Events, SlashCommandBuilder } = require("discord.js");
// ユーザーデータに保存するため読み込み
const { user: userData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("set_intonation")
    .setDescription("全体の抑揚を設定します")
    .addNumberOption((option) => (
      option
        .setName("intonation")
        .setNameLocalizations({
          ja: "抑揚",
        })
        .setDescription("-3 ~ 3 の間で指定してください(デフォルト値: 1 )")
        .setMinValue(-3)
        .setMaxValue(3)
        .setRequired(true)
    )),

  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    // 入力値を保存
    const intonation = interaction.options.getNumber("intonation");

    const memberId = interaction.member.id;

    // ユーザーデータに値をセット
    userData.set(memberId, { intonation });
    await interaction.reply(`:white_check_mark: 全体の抑揚を **${intonation}** に設定しました！`);
  },
};