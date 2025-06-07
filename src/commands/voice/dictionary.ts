const { SlashCommandBuilder, Events, MessageFlags, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");

// botのギルドデータ取得
const { dict: dictData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("dictionary")
    .setDescription("辞書に登録した単語と読みの組み合わせを一覧表示します"),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    const guildId = interaction.guildId;
    const dict = dictData.get(guildId);

    if (!dict) {
      return await interaction.reply({ content: ":warning: 辞書が登録されていません。", flags: MessageFlags.Ephemeral });
    }

    let description = "";
    dict.forEach(element => {
      description += `単語: \`${element.word}\` 読み: \`${element.read}\` 優先度: \`${element.weight}\`\n`;
    });
    description += "\n-# 10分経過後に下部のボタンは消えます。";

    const timeOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const getTime = () => (new Date().toLocaleTimeString("ja-JP", timeOptions));
    const avatar = interaction.guild.members.me.displayAvatarURL();
    const footer = () => ({ text: `実行日時:  ${getTime()}`, iconURL: avatar });


    const sortIntoHiraganaOrder = ({ read: a }, { read: b }) => {
      const shortLength = Math.min(a.length, b.length);
      for (let i = 0; i < shortLength; i++) {
        const diff = a.charCodeAt(i) - b.charCodeAt(i);
        if (diff !== 0) {
          return diff;
        }
      }
      return a.length - b.length;
    };

    const addedOrderCustomId = "addedOrder";
    const hiraganaOrderCustomId = "hiraganaOrder";
    const weightOrderCustomId = "weightOrder";

    const addedOrder = new ButtonBuilder()
      .setCustomId(addedOrderCustomId)
      .setLabel("登録順")
      .setStyle(ButtonStyle.Primary);

    const hiraganaOrder = new ButtonBuilder()
      .setCustomId(hiraganaOrderCustomId)
      .setLabel("50音順")
      .setStyle(ButtonStyle.Primary);

    const weightOrder = new ButtonBuilder()
      .setCustomId(weightOrderCustomId)
      .setLabel("優先度順")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(addedOrder, hiraganaOrder, weightOrder);

    const addedOrderEmbed = new EmbedBuilder()
      .setColor(0xffdbed)
      .setTitle("登録済単語一覧 (登録順)")
      .setDescription(description)
      .setFooter(footer());

    const response = await interaction.reply({ embeds: [addedOrderEmbed], components: [row], withResponse: true });
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10 * 60 * 1000 });

    collector.on("collect", async componentInteraction => {
      await componentInteraction.deferUpdate();

      if (componentInteraction.component.customId === addedOrderCustomId) {
        const addedOrderEmbed2nd = new EmbedBuilder()
          .setColor(0xffdbed)
          .setTitle("登録済単語一覧 (登録順)")
          .setDescription(description)
          .setFooter(footer());
        await componentInteraction.editReply({ embeds: [addedOrderEmbed2nd] });
      }
      else if (componentInteraction.component.customId === hiraganaOrderCustomId) {
        const sortedDict = dict.toSorted(sortIntoHiraganaOrder);
        let hiraganaOrderDescription = "";
        sortedDict.forEach(element => {
          hiraganaOrderDescription += `単語: \`${element.word}\` 読み: \`${element.read}\` 優先度: \`${element.weight}\`\n`;
        });
        hiraganaOrderDescription += "\n-# 10分経過後に下部のボタンは消えます。";

        const hiraganaOrderEmbed = new EmbedBuilder()
          .setColor(0xffdbed)
          .setTitle("登録済単語一覧 (50音順)")
          .setDescription(hiraganaOrderDescription)
          .setFooter(footer());
        await componentInteraction.editReply({ embeds: [hiraganaOrderEmbed] });
      }
      else if (componentInteraction.component.customId === weightOrderCustomId) {
        const sortedDict = dict.toSorted((a, b) => b.weight - a.weight);
        let weightOrderDescription = "";
        sortedDict.forEach(element => {
          weightOrderDescription += `単語: \`${element.word}\` 読み: \`${element.read}\` 優先度: \`${element.weight}\`\n`;
        });
        weightOrderDescription += "\n-# 10分経過後に下部のボタンは消えます。";

        const weightOrderEmbed = new EmbedBuilder()
          .setColor(0xffdbed)
          .setTitle("登録済単語一覧 (優先度順)")
          .setDescription(weightOrderDescription)
          .setFooter(footer());
        await componentInteraction.editReply({ embeds: [weightOrderEmbed] });
      }
    });

    collector.on("end", async () => {
      await response.resource.message.edit({ components: [] });
    });
  },
};