"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
// botのギルドデータ取得
const { dict: dictData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("set_dictionary")
    .setDescription("辞書を設定します (既に登録済の単語の場合上書きされます)")
    .addStringOption((option) => (
      option
        .setName("word")
        .setNameLocalizations({
          "ja": "単語",
        })
        .setDescription("読み方を指定する単語(誤読み上げ防止の観点から1文字のみの登録は推奨しません。)")
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName("read")
        .setNameLocalizations({
          "ja": "読み",
        })
        .setDescription("単語の読み方 (ひらがな)")
        .setRequired(true)
    ))
    .addIntegerOption((option) => (
      option
        .setName("weight")
        .setDescriptionLocalizations({
          "ja": "優先度",
        })
        .setDescription("読み方の優先度(1~10000の整数で指定してください (指定しない場合 5000 で設定されます)")
        .setMinValue(1)
        .setMaxValue(10000)
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    const word = interaction.options.getString("word");
    const read = interaction.options.getString("read");
    let weight = interaction.options.getInteger("weight");

    if (!weight) {
      // 重みが指定されなかった場合のデフォルト値(5000)
      weight = 5000;
    }

    const guildId = interaction.guildId;

    dictData.set(guildId, [ { word, read, weight } ]);
    await interaction.reply(`:white_check_mark: 単語: \`${word}\`, 読み: \`${read}\`, 優先度: \`${weight}\`で登録しました!`);
  },
};