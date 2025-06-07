const { Events, SlashCommandBuilder } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("ずんだもんモード")
    .setDescription("語尾に \"のだ\" をつけて読み上げます"),
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    const memberId = interaction.member.id;

    // userDataにzundamonModeのT/Fをセット
    if (!userData.get(memberId)?.zundamonMode) {
      userData.set(memberId, { zundamonMode: true });
      await interaction.reply(":white_check_mark: ずんだもんモード **オン** に設定したのだ！");
    }
    else if (userData.get(memberId)?.zundamonMode) {
      userData.set(memberId, { zundamonMode: false });
      await interaction.reply(":white_check_mark: ずんだもんモード **オフ** に設定したのだ....");
    }
  },
};