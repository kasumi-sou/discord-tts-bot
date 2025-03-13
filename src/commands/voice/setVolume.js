"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("set_volume")
		.setDescription("全体の音量を設定します")
		.addNumberOption((option) => (
			option
				.setName("volume")
				.setDescription("0 以上の値を指定してください(デフォルト値: 1 )")
				.setRequired(true)
		)),
	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {
		const volume = interaction.options.getNumber("volume");


		if (volume < 0) {
			await interaction.reply(":warning: **値が不正です！**");
			return;
		}

		const memberId = interaction.member.id;

		userData.set(memberId, { volume });
		await interaction.reply(`:white_check_mark: 全体の音量を **${volume}** に設定しました！`);
	},
};