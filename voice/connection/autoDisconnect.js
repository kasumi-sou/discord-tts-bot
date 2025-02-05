const { VoiceConnectionStatus, entersState } = require("@discordjs/voice");

module.exports = {
	name: VoiceConnectionStatus.Disconnected,
	once: false,
	async execute(oldState, newState) {
		try {
			await Promise.race([
				entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
				entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
			]);
		}
		catch {
			connection.destroy();
		}
	},
};