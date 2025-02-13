// const fs = require("node:fs");
const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");
const convertMessages = require("./convertMessages");

module.exports = async function(message) {
	const messageContent = convertMessages(message);
	const audioResource = await generateAudio(message, messageContent);
	await playVoice(audioResource, message.guild.id);
	// fs.unlinkSync(audioResource);
};