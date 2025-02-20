const { SlashCommandBuilder, Events } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("set_pitch")
		.setDescription("声のピッチを設定します")
		.addStringOption((option) => (
			option
				.setName("pitch")
				.setDescription("-3 ~ 3の間で指定してください(デフォルト値: 0 )")
				.setRequired(true)
		)),
	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {

		const pitch = interaction.options.getString("pitch");

		// eslint-disable-next-line yoda
		if (pitch < -3 || 3 < pitch) {
			await interaction.reply(":warning: **値が不正です！**");
			return;
		}
		const memberId = interaction.member.id;
		userData.set(memberId, { pitch });
		await interaction.reply(`:white_check_mark: 声のピッチを **${pitch}倍** に設定しました！`);
	},
};