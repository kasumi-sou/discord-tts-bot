const { SlashCommandBuilder, Events } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const channelId = require("../../data");
module.exports = {
	name: Events.InteractionCreate,
	once: false,
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("VCに参加します"),
	async execute(interaction) {
		const guild = interaction.guild;
		const member = await guild.members.fetch(interaction.member.id);
		const channel = member.voice.channel;
		const connectedChannel = interaction.guild.members.me.voice.channel;
		if (!channel) {
			return interaction.reply(":cold_sweat: VCに参加してから実行してください");
		}
		else if (connectedChannel) {
			return interaction.reply(`:shaking_face: 既に **${connectedChannel.name}** に参加しています`);
		}
		else if (!connectedChannel) {
			const connection = joinVoiceChannel({
				guildId: guild.id,
				channelId: channel.id,
				adapterCreator: guild.voiceAdapterCreator,
				selfMute: false,
			});
			await interaction.reply(`:partying_face: **${channel.name}** に参加しました！`);
			channelId.set(guild.id, interaction.channelId);
		}
		else {
			await interaction.reply("An unexpected error occurred.");
			console.error("An unexpected error occurred.");
			return;
		}
	},
};