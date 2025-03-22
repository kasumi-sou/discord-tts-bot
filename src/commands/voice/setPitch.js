"use strict";

const { SlashCommandBuilder, Events, MessageFlags } = require("discord.js");
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
        .setRequired(true)
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    const pitch = interaction.options.getNumber("pitch");

    // eslint-disable-next-line yoda
    if (pitch < -3 || 3 < pitch) {
      // APIの仕様上多分数に制限はないようであるが統一性重視で-3~3に制限
      await interaction.reply({ content: ":warning: **値が不正です！**", flags: MessageFlags.Ephemeral });
      return;
    }
    const memberId = interaction.member.id;
    // ユーザーデータに保存
    userData.set(memberId, { pitch });
    await interaction.reply(`:white_check_mark: 全体の音高を **${pitch}** に設定しました！`);
  },
};