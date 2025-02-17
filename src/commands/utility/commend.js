const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("command")
		.setDescription("利用可能なコマンドを表示します。"),
	async execute(interaction) {
		const command = new EmbedBuilder()
			.setColor(0xffdbed)
			.setTitle("利用可能なコマンド一覧")
			.addFields(
				{ name: "ボイスチャンネルに参加します。", value: "```/join```" },
				{ name: "ボイスチャンネルから退出します。", value: "```/leave```" },
				{ name: "Google検索(もどき)をします。", value: "```/google```" },
				{ name: "ヘルプを表示します。", value: "```/help```" },
				{ name: "コマンド一覧を表示します。", value: "```/command```" },
			);
		await interaction.reply({ embeds: [command] });
	},
};