const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("テスト用"),
	async execute(interaction) {
		await interaction.reply("テスト成功");
	},
};