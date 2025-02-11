const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("テスト用")
		.addStringOption(option =>
			option.setName("カテゴリ")
				.setDescription("選択肢型テスト")
				.setRequired(true)
				.addChoices(
					{ name: "選択肢1", value: "choice1" },
					{ name: "選択肢2", value: "choice2" },
					{ name: "選択肢3", value: "choice3" },
				)),
	async execute(interaction) {
		const category = interaction.options.getString("カテゴリ");
		if (category === "choice1") {
			await interaction.reply("選択したものは選択肢1です。");
		}
		else if (category === "choice2") {
			await interaction.reply("選択したものは選択肢2です。");
		}
		else if (category === "choice3") {
			await interaction.reply("選択したものは選択肢3です。");
		}
		else {
			console.error("category number is not correct");
		}
	},
};