"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
const si = require("systeminformation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sys_info")
    .setDescription("BOTを実行してるサーバーに関する情報を表示します")
    .addStringOption(option =>
      option
        .setName("option")
        .setDescription("選択した項目の詳細な情報を返します")
        .addChoices({ name: "CPU", value: "cpu" })
        .addChoices({ name: "メモリ", value: "mem" })
        .addChoices({ name: "GPU", value: "gpu" }),
    ),

  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    await interaction.deferReply();

    const option = interaction.options.getString("option");

    if (option === "cpu") {
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
    if (option === "mem") {
      const memDetails = await si.memLayout();
      const memInfo = [];
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      memDetails.forEach((mem, index) => {
        let isEcc = mem.ecc;
        isEcc ? isEcc = "あり" : isEcc = "なし";

        memInfo[index] = { name: `メモリ${index}`, value: `容量: \`${(mem.size / (1024 ** 3)).toFixed(1)}\` GB\nバンク: \`${mem.bank}\`\nECC対応: \`${isEcc}\`\n速度: \`${mem.clockSpeed}\` MHz\n規格: \`${mem.formFactor}\`\n製造者: \`${mem.manufacturer}\`\n型番: \`${mem.partNum}\`\n設定電圧: \`${mem.voltageConfigured}\` V`, inline: true };
      });

      const memEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setTitle("メモリ 情報")
        .setDescription(`空きメモリ: \`${(freeMem / (1024 ** 3)).toFixed(1)}\` GB\n使用中メモリ: \`${((totalMem - freeMem) / (1024 ** 3)).toFixed(1)}\` GB\n合計メモリ: \`${(totalMem / (1024 ** 3)).toFixed(1)}\` GB\n使用率: \`${((totalMem - freeMem) * 100 / totalMem).toFixed(2)}\`%`)
        .addFields(...memInfo);

      await interaction.followUp({ embeds: [memEmbed] });
    }
    if (option === "gpu") {
      const { controllers: gpuDetails } = await si.graphics();
      const gpuInfo = [];
      gpuDetails.forEach((gpu, index) => {
        // eslint-disable-next-line no-irregular-whitespace
        gpuInfo[index] = { name: `GPU${index}`, value: `型番: ${gpu?.model} (${gpu?.vram ? gpu.vram / 1024 : "-"} GB)\nVRAM\n\u200b　空き: \`${gpu?.memoryFree || "-"}\`MB\n\u200b　使用中: \`${gpu?.memoryUsed || "-"}\`MB\n\u200b　合計: \`${gpu?.memoryTotal || "-"}\` MB\n\u200b　使用率: \`${gpu?.memoryUsed && gpu?.memoryTotal ? (gpu.memoryUsed * 100 / gpu.memoryTotal).toFixed(2) : "-"}\`%\nGPU温度: \`${gpu?.temperatureGpu || "-"}\` ℃\n消費電力: \`${gpu?.powerDraw || "-"}\` W\n速度\n\u200b　コア: \`${gpu?.clockCore || "-"}\` MHz\n\u200b　メモリ: \`${gpu?.clockMemory || "-"}\` MHz` };
      });
      const memEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setTitle("GPU 情報")
        .addFields(...gpuInfo);

      await interaction.followUp({ embeds: [memEmbed] });
    }
    else {
      const [cpu, { controllers: [gpu] }, freeMem, totalMem] = await Promise.all([
        si.cpu(),
        si.graphics(),
        os.freemem(),
        os.totalmem(),
      ]);

      const infoEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setTitle("サーバーInfo")
        .addFields(
          { name: "CPU", value: `型番: \`${cpu.manufacturer} ${cpu.brand} (${cpu.physicalCores}C/${cpu.cores}T)\`` },
          { name: "メモリ", value:`空きメモリ: \`${(freeMem / (1024 ** 3)).toFixed(1)}\` GB\n使用中メモリ: \`${((totalMem - freeMem) / (1024 ** 3)).toFixed(1)}\` GB\n合計メモリ: \`${(totalMem / (1024 ** 3)).toFixed(1)}\` GB\n使用率: \`${((totalMem - freeMem) * 100 / totalMem).toFixed(2)}\`%` },
          { name: "GPU", value: `\`${gpu.model} (${gpu.vram / 1024} GB)\`` },
        );

      await interaction.followUp({ embeds: [infoEmbed] });
    }
  },
};
