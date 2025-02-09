const fs = require("node:fs");
const { default: axios } = require("axios");
const rpc = axios.create({ baseURL: "http://localhost:50021", proxy: false });


module.exports = async function readMessages(message) {
	// const soundPath = `sounds/${message.author.id}.wav`;
	const soundPath = `sounds/${message.author.id}.wav`;
	const default_voice = "6";
	const VoiceMap = new Map;
	let voice = VoiceMap.get(message.author.id);
	if (!voice) {
		voice = default_voice;
	}
	// const convMessage = convertMessage(message.cleanContent);
	const convMessage = message;
	await generateAudio(convMessage, soundPath, voice);
	// await play(convMessage, soundPath);
	console.log(message.cleanContent);

	// ここまで 旧readMessages.jsの内容
	// ここから 旧generateAudio.jsの内容
	async function generateAudio(text, filePath, speakerName) {
		const audioQuery = await rpc.post(`audio_query?text=${encodeURI(text)}&speaker=${speakerName}`, {
			headers: { "accept": "application/json" },
		});

		const synthesis = await rpc.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery.data), {
			responseType: "arraybuffer",
			headers: {
				"accept": "audio/wav",
				"Content-Type": "application/json",
			},
		});

		fs.writeFileSync(filePath, new Buffer.from(synthesis.data), "binary");
		return filePath;
	}
};