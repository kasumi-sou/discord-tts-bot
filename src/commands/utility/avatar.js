"use strict";

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("アバター画像を返します。")
		.addUserOption(option =>
			option.setName("user")
				.setDescription("ユーザを選択してください。")
				.setRequired(true),
		),
	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {
		const member = interaction.options.getMember("user");
		const command = new EmbedBuilder()
			.setColor(0xffdbed)
			.setTitle(`${member.displayName} のアバター`)
			// .setURL(member.displayAvatarURL())
			.setImage(member.displayAvatarURL({ size: 1024 }));

		await interaction.reply({ embeds: [command] });
	},

};