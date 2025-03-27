const { SlashCommandBuilder, Events, MessageFlags, AttachmentBuilder } = require("discord.js");
// const fs = require("fs");

// botのギルドデータ取得
const { dict: dictData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("export_dictionary")
    .setDescription("登録している辞書データを指定された形式で出力します")
    .addStringOption(option => (
      option
        .setName("format")
        .setNameLocalizations({
          ja: "出力形式",
        })
        .setRequired(true)
        .setDescription("辞書データの出力形式を選択してください")
        .addChoices(
          { name: ".json", value: "json" },
        )
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    const type = interaction.options.getString("format");
    const guildId = interaction.guildId;
    const getDictData = dictData.get(guildId);
    const dictJson = JSON.stringify(getDictData, undefined, "  ");

    if (!getDictData) {
      return await interaction.reply({ content: ":warning: 辞書が登録されていません。", flags: MessageFlags.Ephemeral });
    }
    if (type === "json") {
      await interaction.reply({ content: ":white_check_mark: 出力完了！", files: [new AttachmentBuilder(Buffer.from(dictJson), { name: `${guildId}.json` })] });
    }
  },
};