const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { token } = require("../config.json");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
	],
});

const messageContent = new EmbedBuilder()
	.setColor(0xffdbed)
	.setTitle(":loudspeaker: 新着機能が追加されました！")
	.setDescription("新着機能の一部をご紹介します！")
	.addFields(
		{ name: "ヘルプを表示します。", value: "```/help```" },
		{ name: "コマンド一覧を表示します。", value: "```/command```" },
		{ name: "読み上げの声を設定します。", value: "```/set_voice```" },
		{ name: "アバター画像を表示します。", value: "```/avatar```" },
	)
	.addFields(
		{ name: "そのほかの変更はこちらをご覧ください。", value: "https://github.com/kasumi-sou/discord-tts-bot" },
	);

client.once("ready", async () => {
	sendMessage();
});

const sendMessage = async () => {
	await Promise.all(
		client.guilds.cache.map(async guild => {
			const systemChannel = guild.systemChannel;
			await systemChannel?.send({ embeds: [messageContent] })
				.then(() => console.log(`${guild.name}へ送信完了`))
				.catch(err => console.error(`${guild.name}への送信失敗`, err));
		}),
	);
	console.log("処理完了");
	await client.destroy();
};

client.login(token);