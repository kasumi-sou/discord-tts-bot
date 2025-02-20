// const fs = require("node:fs");
const { default: axios } = require("axios");
const rpc = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const { createAudioResource } = require("@discordjs/voice");
const { Readable } = require("node:stream");
const { user: userData } = require("../../data");


module.exports = async function readMessages(messageContent, userId) {
	// const soundPath = `sounds/${message.author.id}.wav`;
	// const soundPath = `sounds/${message.id}.wav`;
	// const defaultVoice = "14";
	const defaultVoice = "6";
	let voice = userData.get(userId)?.style;
	if (!voice) {
		voice = defaultVoice;
	}
	// console.log(voice);
	// const convMessage = message;
	const resource = await generateAudio(messageContent, voice);
	// await play(convMessage, soundPath);
	console.log(messageContent);

	// ここまで 旧readMessages.jsの内容
	// ここから 旧generateAudio.jsの内容
	async function generateAudio(text, speakerName) {
		const audioQueryRes = await rpc.post(`audio_query?text=${encodeURI(text)}&speaker=${speakerName}`, {
			headers: { "accept": "application/json" },
		});
		const audioQuery = { ...audioQueryRes.data };
		const memberData = userData.get(userId);

		if (memberData?.speed) {
			audioQuery.speedScale = memberData.speed;
		}

		if (memberData?.pitch) {
			audioQuery.pitchScale = memberData.pitch;
		}

		audioQuery.outputStereo = false;

		const synthesis = await rpc.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery), {
			responseType: "arraybuffer",
			headers: {
				"accept": "audio/wav",
				"Content-Type": "application/json",
			},
		});

		// fs.writeFileSync(filePath, new Buffer.from(synthesis.data), "binary");
		// return filePath;
		return createAudioResource(Readable.from(synthesis.data));
	}
	return resource;
};