const { Events, SlashCommandBuilder } = require("discord.js");
const { user: userData } = require("../../data");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("set_intonation")
		.setDescription("全体の抑揚を設定します")
		.addStringOption((option) => (
			option
				.setName("intonation")
				.setDescription("-3 ~ 3 の間で指定してください(デフォルト値: 1 )")
				.setRequired(true)
		)),

	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {

		const intonation = interaction.options.getString("intonation");

		// eslint-disable-next-line yoda
		if (intonation < -3 || 3 < intonation) {
			await interaction.reply(":warning: **値が不正です！**");
			return;
		}

		const memberId = interaction.member.id;

		userData.set(memberId, { intonation });
		await interaction.reply(`:white_check_mark: 全体の抑揚を **${intonation}** に設定しました！`);
	},
};