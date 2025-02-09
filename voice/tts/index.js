const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");

module.exports = function(message) {
	const filePath = generateAudio(message);
	playVoice(filePath, message.guild.id);
};