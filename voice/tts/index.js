const fs = require("node:fs");
const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");

module.exports = async function(message) {
	const filePath = await generateAudio(message);
	await playVoice(filePath, message.guild.id);
	fs.unlinkSync(filePath);
};