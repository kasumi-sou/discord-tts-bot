const { SlashCommandBuilder, Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const data = require("../../data");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("VCから退出します"),

	async execute(interaction) {
		const connection = getVoiceConnection(interaction.guildId);
		const guild = interaction.guild;
		const member = await guild.members.fetch(interaction.member.id);
		const channel = member.voice.channel;
		const connectedChannel = interaction.guild.members.me.voice.channel;
		if (!channel) {
			return interaction.reply(":cold_sweat: VCに参加してから実行してください");
		}
		else if (!connection || !data.get(guild.id)) {
			return interaction.reply(":thinking: BOTは現在VCに参加していません");
		}
		else if (connection) {
			data.delete(guild.id);
			connection.destroy();
			interaction.reply(`:wave: **${connectedChannel.name}** から切断しました!`);
		}
		else {
			await interaction.reply("An unexpected error occurred.");
			console.error("An unexpected error occurred.");
		}
	},
};