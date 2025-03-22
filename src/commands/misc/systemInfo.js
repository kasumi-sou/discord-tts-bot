const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const sysInfo = require("systeminformation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sys_info")
    .setDescription("BOTの実行環境に関する情報を表示します"),

  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    await interaction.deferReply();
    const [cpu, { controllers: [gpu] }] = await Promise.all([
      sysInfo.cpu(),
      sysInfo.graphics(),
    ]);

    const description = `CPU: ${cpu.manufacturer} ${cpu.brand}\nGPU: ${gpu.vendor} ${gpu.model}`;
    await interaction.followUp(description);
  },
};