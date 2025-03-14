"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { google } = require("googleapis");
const customSearch = google.customsearch("v1");

const { engineId } = require("../../../config.json");
const { googleApiKey } = require("../../../config.json");

// 未実装 いつかやる™
// 実装したﾖ
module.exports = {
	data: new SlashCommandBuilder()
		.setName("google")
		.setDescription("Google検索をします")
		.addStringOption((option) => (
			option
				.setName("keyword")
				.setDescription("検索するキーワードを入力してください")
				.setRequired(true)
		)),
	async execute(interaction) {
		const keyword = interaction.options.getString("keyword");

		// googlecustomsearch
		const result = await customSearch.cse.list({
			auth: googleApiKey,
			cx: engineId,
			q: keyword,
		});

		const resultList = result.data.items;

		const timeOptions = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		const nowTime = new Date().toLocaleTimeString("ja-JP", timeOptions);

		// 検索結果リスト
		let description = "";
		resultList.forEach((item) => description += `[${item.title}](${item.link})  \`${item.displayLink}\`\n-# ${item.snippet}\n\n`);

		const resultEmbed = new EmbedBuilder()
			.setColor(0xffdbed)
			.setTitle(`"${keyword}" の検索結果`)
			.setURL(`https://www.google.co.jp/search?q=${keyword}`)
			.setDescription(description)
			.setFooter({ text: `検索日時:  ${nowTime}`, iconURL: interaction.guild.members.me.displayAvatarURL() });

		// console.log(resultList);

		await interaction.reply({ embeds: [resultEmbed] });

	},
};