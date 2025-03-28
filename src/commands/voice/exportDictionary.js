const { SlashCommandBuilder, Events, AttachmentBuilder, MessageFlags } = require("discord.js");
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
    const format = interaction.options.getString("format");
    const attachment = dictData.export(guildId, format);

    if (!attachment) {
      await interaction.reply({ content: ":warning: 何らかのエラーが発生しました", flags: MessageFlags.Ephemeral });
      return;
    }
    if (format === "json") {
      await interaction.reply({ content: ":white_check_mark: 出力完了！", files: [new AttachmentBuilder(Buffer.from(attachment), { name: `${guildId}.json` })] });
    }
  },
};