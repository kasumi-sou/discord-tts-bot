"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("set_speed")
		.setDescription("全体の話速を設定します")
		.addNumberOption((option) => (
			option
				.setName("speed")
				.setDescription("0.3 ~ 5 の間で指定してください(デフォルト値: 1 )")
				.setRequired(true)
		)),
	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {

		const speed = interaction.options.getNumber("speed");

		// eslint-disable-next-line yoda
		if (speed < 0.3 || 5 < speed) {
			// 0.1とか実用的でないので0.3~, 5でも早すぎて全然聞き取れないレベルだったので上限5で設定
			await interaction.reply(":warning: **値が不正です！**");
			// 処理止まってくれないと困るのでリターン
			return;
		}
		const memberId = interaction.member.id;
		// 例のごとく値をセット
		userData.set(memberId, { speed });
		await interaction.reply(`:white_check_mark: 全体の話速を **${speed}** に設定しました！`);
	},
};