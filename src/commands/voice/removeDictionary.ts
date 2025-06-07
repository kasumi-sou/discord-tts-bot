"use strict";

const { SlashCommandBuilder, Events, MessageFlags } = require("discord.js");
// botのギルドデータ取得
const { dict: dictData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("remove_dictionary")
    .setDescription("辞書を削除します")
    .addStringOption(option => (
      option
        .setName("word")
        .setNameLocalizations({
          ja: "単語",
        })
        .setDescription("削除する単語")
        .setRequired(true)
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    const word = interaction.options.getString("word");
    const guildId = interaction.guildId;

    // dictが空配列のとき
    if (!dictData.delete(guildId, word)) {
      return await interaction.reply({ content: ":warning: 辞書が登録されていません。", flags: MessageFlags.Ephemeral });
    }


    await interaction.reply(`\`${word}\` の読みを辞書から削除しました。`);

  },
};