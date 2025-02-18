const { EmbedBuilder } = require("discord.js");
const { version } = require("../package.json");
module.exports = new EmbedBuilder()
	.setColor(0xffdbed)
	.setTitle(`:tada: アップデート ${version}`)
	.setDescription(`${version}にアップデートされました！新機能の一部をご紹介します！`)
	.addFields(
		{ name: "\n", value: "\n" },
		{ name: "ヘルプを表示します。", value: "```/help```" },
		{ name: "コマンド一覧を表示します。", value: "```/command```" },
		{ name: "読み上げの声を設定します。", value: "```/set_voice```" },
		{ name: "アバター画像を表示します。", value: "```/avatar```" },
		{ name: "\n", value: "\n" },
		{ name: "その他の更新についてはこちらをご覧ください！", value: `https://github.com/kasumi-sou/discord-tts-bot/releases/v${version}` },
	);
