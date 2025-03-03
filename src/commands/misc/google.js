"use strict";

const { SlashCommandBuilder } = require("discord.js");

// 未実装 いつかやる™
module.exports = {
	data: new SlashCommandBuilder()
		.setName("google")
		.setDescription("Google検索をします"),
	async execute(interaction) {
		await interaction.reply("ggrks");
	},
};