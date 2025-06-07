"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("set_speed")
    .setDescription("全体の話速を設定します")
    .addNumberOption((option) => (
      option
        .setName("speed")
        .setNameLocalizations({
          ja: "話速",
        })
        .setDescription("0.3 ~ 5 の間で指定してください(デフォルト値: 1 )")
        .setMinValue(0.3)
        .setMaxValue(5)
        .setRequired(true)
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    const speed = interaction.options.getNumber("speed");

    const memberId = interaction.member.id;
    // 例のごとく値をセット
    userData.set(memberId, { speed });
    await interaction.reply(`:white_check_mark: 全体の話速を **${speed}** に設定しました！`);
  },
};