"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sys_info")
    .setDescription("BOTを実行してるサーバーに関する情報を表示します")
    .addStringOption(option =>
      option
        .setName("option")
        .setDescription("選択した項目の詳細な情報を返します")
        .addChoices({ name: "CPU", value: "cpu" }),
    ),

  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    await interaction.deferReply();

    const optionCpu = interaction.options.getString("option");

    if (optionCpu === "cpu") {
      const cpuDetails = os.cpus();
      const processorInfo = [];
      cpuDetails.forEach((processor, index) => {
        // eslint-disable-next-line no-irregular-whitespace
        processorInfo[index] = { name: `CPU ${index}`, value: `モデル: \`${processor.model.trim()}\`\n速度: \`${processor.speed / 1000} GHz\`\n起動時間\n\u200b　(user): \`${(processor.times.user / 1000).toFixed(0)}\`sec\n\u200b　(nice): \`${(processor.times.nice / 1000).toFixed(0)}\`sec\n\u200b　(system): \`${(processor.times.sys / 1000).toFixed(0)}\`sec\n\u200b　(idle): \`${(processor.times.idle / 1000).toFixed(0)}\`sec\n\u200b　(irq): \`${(processor.times.irq / 1000).toFixed(0)}\`sec`, inline: true };
      });

      const cpuEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setTitle("CPU 情報")
        .addFields(...processorInfo);

      await interaction.followUp({ embeds: [cpuEmbed] });
    }
    else {
      const [cpu, { controllers: [gpu] }, freeMem, totalMem] = await Promise.all([
        sysInfo.cpu(),
        sysInfo.graphics(),
        os.freemem(),
        os.totalmem(),
      ]);

      const infoEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setTitle("サーバーInfo")
        .addFields(
          { name: "CPU", value: `${cpu.manufacturer} ${cpu.brand}` },
          { name: "Memory", value:`freeMemory: \`${(freeMem / (1024 ** 3)).toFixed(1)}\` GB\nusedMemory: \`${((totalMem - freeMem) / (1024 ** 3)).toFixed(1)}\` GB\ntotalMemory: \`${(totalMem / (1024 ** 3)).toFixed(1)}\` GB\nmemoryUsage: \`${((totalMem - freeMem) * 100 / totalMem).toFixed(2)}\`%` },
          { name: "GPU", value: gpu.model },
        );

      await interaction.followUp({ embeds: [infoEmbed] });
    }
  },
};
