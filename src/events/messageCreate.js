"use strict";

const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const reply = require("../reply/");
// const readMessages = require("../voice/tts/readMessages");
const { playMessage } = require("../voice/tts/");
const { guild } = require("../data");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		try {
			// botのメッセージはスルー
			if (message.author.bot) {
				return;
			}
			// これは自動で返信するやつ
			await reply(message);
			const connection = getVoiceConnection(message.guildId);
			// ボイスチャンネルに接続していなくてデータベースに紐づけなかったらリターン
			if (!connection || !guild.get(message.guildId)?.channel) { return; }
			// 接続があったら
			else if (connection) {
				if (message.channel.id === guild.get(message.guildId).channel) {
					// 'から始まるメッセージは読まない
					if (message.content.startsWith("'")) {
						return;
					}
				  await playMessage(message);
				}
			}
			else { console.error("An unexpected error occurred."); }
		}
		catch (e) {console.error(e);};
	},
};