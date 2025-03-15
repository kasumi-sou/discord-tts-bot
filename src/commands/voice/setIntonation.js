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
        .setDescription("-3 ~ 3 の間で指定してください(デフォルト値: 1 )")
        .setRequired(true)
    )),

  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    // 入力値を保存
    const intonation = interaction.options.getNumber("intonation");

    // eslint-disable-next-line yoda
    if (intonation < -3 || 3 < intonation) {
      // APIの仕様では多分値に制限はないみたいだが、一応-3~3に制限
      await interaction.reply(":warning: **値が不正です！**");
      // 処理続いたら困るのでリターン
      return;
    }

    const memberId = interaction.member.id;

    // ユーザーデータに値をセット
    userData.set(memberId, { intonation });
    await interaction.reply(`:white_check_mark: 全体の抑揚を **${intonation}** に設定しました！`);
  },
};