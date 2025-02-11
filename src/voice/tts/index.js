const fs = require("node:fs");
const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");
const convertMessages = require("./convertMessages");

module.exports = async function(message) {
	const messageContent = convertMessages(message.cleanContent);
	const filePath = await generateAudio(message, messageContent);
	await playVoice(filePath, message.guild.id);
	fs.unlinkSync(filePath);
};