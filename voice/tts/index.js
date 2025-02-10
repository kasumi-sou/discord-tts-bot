const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");

module.exports = async function(message) {
	const filePath = await generateAudio(message);
	playVoice(filePath, message.guild.id);
};