const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");

module.exports = function(message) {
	const exptMesssage = generateAudio(message);
	playVoice(exptMesssage);
};