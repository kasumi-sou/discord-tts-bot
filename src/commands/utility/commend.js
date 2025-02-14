const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("command")
		.setDescription("利用可能なコマンドを表示します"),
	async execute(interaction) {
		const command = new EmbedBuilder()
			.setColor(0xffdbed)
			.setTitle("利用可能なコマンド一覧")
			.addFields(
				{ name: "VCに参加", value: "```/join```" },
				{ name: "VCから退出", value: "```/leave```" },
				{ name: "Google検索(もどき)", value: "```/google```" },
				{ name: "ヘルプを表示", value: "```/help```" },
				{ name: "コマンド一覧を表示", value: "```/command```" },
			);
		await interaction.reply({ embeds: [command] });
	},
};