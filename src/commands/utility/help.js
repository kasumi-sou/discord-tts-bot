const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("ヘルプを表示します。"),
	async execute(interaction) {
		const help = new EmbedBuilder()
			.setColor(0xffdbed)
			.setTitle("Discord-TTS-Bot")
			.setURL("https://github.com/kasumi-sou/discord-tts-bot")
			.setDescription("オープンソースのDiscord.js製の読み上げBOTです。\n読み上げにはVOICEVOXを使用しています。\n利用可能なコマンドを確認するには `/command` を使用してください。\n不具合が発生した場合githubでissueを作成していただけると助かります。")
			.addFields(
				{ name: "ソースコード", value: "https://github.com/kasumi-sou/discord-tts-bot" },
				{ name: "制作者", value: "https://github.com/kasumi-sou" },
			);
		await interaction.reply({ embeds: [help] });
	},
};