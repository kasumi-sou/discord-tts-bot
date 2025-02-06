module.exports = async function readMessages(message) {
	const soundPath = `../sounds/${message.author.id}.wav`;
	const default_voice = "6";
	const VoiceMap = new Map;
	let voice = VoiceMap.get(message.author.id);
	if (!voice) {
		voice = default_voice;
	}
	// const convMessage = convertMessage(message.cleanContent);
	const convMessage = message;
	// await generateAudio(convMessage, soundPath, voice);
	// await play(convMessage, soundPath);
	console.log(message.cleanContent);
};