"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("set_speed")
		.setDescription("全体の話速を設定します")
		.addStringOption((option) => (
			option
				.setName("speed")
				.setDescription("0.3 ~ 5 の間で指定してください(デフォルト値: 1 )")
				.setRequired(true)
		)),
	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {

		const speed = interaction.options.getString("speed");

		// eslint-disable-next-line yoda
		if (speed < 0.3 || 5 < speed) {
			await interaction.reply(":warning: **値が不正です！**");
			return;
		}
		const memberId = interaction.member.id;
		userData.set(memberId, { speed });
		await interaction.reply(`:white_check_mark: 全体の話速を **${speed}** に設定しました！`);
	},
};