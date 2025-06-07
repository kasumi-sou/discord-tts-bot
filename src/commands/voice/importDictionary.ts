const { SlashCommandBuilder, Events, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, AttachmentBuilder } = require("discord.js");
const { default: axios } = require("axios");
const { dict: dictData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("import_dictionary")
    .setDescription("辞書をインポートします")
    .addAttachmentOption(option => (
      option
        .setName("dictionary_file")
        .setDescription("インポートする辞書を選択してください")
        .setRequired(true)
    )),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {

    const guildId = interaction.guildId;
    const yesCustomId = "yes";
    const noCustomId = "no";
    const cancelCustomId = "cancel";

    const yesButton = new ButtonBuilder()
      .setCustomId(yesCustomId)
      .setLabel("はい")
      .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
      .setCustomId(noCustomId)
      .setLabel("いいえ(エクスポートしない)")
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId(cancelCustomId)
      .setLabel("操作をキャンセル")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(yesButton, noButton, cancelButton);

    const attachment = interaction.options.getAttachment("dictionary_file");
    const url = attachment.url;

    // 警告文
    const alertEmbed = new EmbedBuilder()
      .setColor(0xffdbed)
      .setDescription(":warning: インポートすると、既存の辞書は上書きされます。\nインポートの前に、既存の辞書をエクスポートしますか？\n-# 10分経過後に自動でキャンセルされます。");

    const response = await interaction.reply({ embeds: [alertEmbed], components: [row], withResponse: true });
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10 * 60 * 1000 });

    collector.on("collect", async componentInteraction => {
      await componentInteraction.deferUpdate();
      if (componentInteraction.component.customId === yesCustomId) {
        const formatSelectCustomId = "format";
        const optionJsonValue = "json";

        // 下部セレクトメニュー
        const formatSelectMenu = new StringSelectMenuBuilder()
          .setCustomId(formatSelectCustomId)
          .setPlaceholder("辞書データの出力形式を選択してください")
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("json")
              .setDescription("json形式のデータ")
              .setValue(optionJsonValue),
          );
        // 出力形式選択エンベッド
        const formatSelectEmbed = new EmbedBuilder()
          .setColor(0xffdbed)
          .setDescription("登録している辞書データを指定された形式で出力します\n-# 10分経過後に自動でキャンセルされます。");

        const formatSelectRow = new ActionRowBuilder()
          .addComponents(formatSelectMenu);

        await componentInteraction.editReply({ embeds: [formatSelectEmbed], components: [formatSelectRow], withResponse: true });
        const selectMenuCollector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 10 * 60 * 1000 });

        selectMenuCollector.on("collect", async selectMenuInteraction => {
          // 辞書出力
          const format = selectMenuInteraction.component.options[0].value;
          const exportFile = dictData.export(guildId, format);
          if (!exportFile) {
            await interaction.reply({ content: ":warning: 何らかのエラーが発生しました", flags: MessageFlags.Ephemeral });
            return;
          }
          await selectMenuInteraction.reply({ content: ":white_check_mark: 出力完了！", files: [new AttachmentBuilder(Buffer.from(exportFile), { name: `${guildId}.json` })] });
          importDictionary(selectMenuInteraction);
        });
      }
      else if (componentInteraction.component.customId === noCustomId) {
        importDictionary(componentInteraction);
      }
      else if (componentInteraction.component.customId === cancelCustomId) {
        const cancelEmbed = new EmbedBuilder()
          .setColor(0xffdbed)
          .setDescription(":x: 操作をキャンセルしました！");
        await componentInteraction.editReply({ embeds: [cancelEmbed], components: [] });
      }
    });

    collector.on("end", async () => {
      // 10分経過後
      const cancelEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setDescription(":x: 操作をキャンセルしました！");
      await response.resource.message.edit({ embeds: [cancelEmbed], components: [] });
    });

    // 辞書インポート
    const importDictionary = async (i) => {
      const completeEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setDescription(":white_check_mark: 辞書のインポートが完了しました！");
      try {
        const { data: fileStr } = await axios.get(url, { responseType: "text" });
        const importDict = dictData.import(guildId, JSON.parse(fileStr));
        if (!importDict) {
          const errorEmbed = new EmbedBuilder()
            .setColor(0xffdbed)
            .setDescription(":warning: 辞書の形式が正しくありません！");
          await i.editReply({ embeds: [errorEmbed], components: [] });
          return;
        }
        await i.editReply({ embeds: [completeEmbed], components: [] });
      }
      catch (e) {
        console.error(e);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xffdbed)
          .setDescription(":warning: 辞書の形式が正しくありません！");
        await i.editReply({ embeds: [errorEmbed], components: [] });
        return;
      }
    };
  },
};