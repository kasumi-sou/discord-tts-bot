"use strict";

// const fs = require("node:fs");
const { default: axios } = require("axios");
const rpcVoiceVox = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const rpcAivis = axios.create({ baseURL: "http://localhost:10101", proxy: false });
const { createAudioResource } = require("@discordjs/voice");
const { Readable } = require("node:stream");
const { user: userData } = require("../../data");


module.exports = async function readMessages(messageContent, userId) {
	// const soundPath = `sounds/${message.author.id}.wav`;
	// const soundPath = `sounds/${message.id}.wav`;
	// const defaultVoice = "14";
	let voiceId = userData.get(userId)?.style;
	const voiceIdDigit = voiceId.toString().length;

	// 6は四国めたん
	const defaultVoice = "6";

	// voicevox使用かaivis使用かはidの桁数で判定
	if (voiceIdDigit <= 2) {
		// voiceIdが2桁以下、すなわちvoicevoxのキャラidが指定されている場合voicevoxで音声生成
		const resource = await generateAudioVoiVo(messageContent, voiceId);
		console.log(messageContent);
		return resource;
	}
	else if (voiceIdDigit > 2) {
		// voiceIdが二桁より大きい(aivisのキャラidは9桁?)場合はaivisで音声生成
		const resource = await generateAudioAivis(messageContent, voiceId);
		console.log(messageContent);
		return resource;
	}
	else if (!voiceId) {
		// そもそもvoiceIdなければ四国めたんでvoicevoxで生成
		voiceId = defaultVoice;
		const resource = await generateAudioAivis(messageContent, voiceId);
		console.log(messageContent);
		return resource;
	}


	// console.log(voice);
	// const convMessage = message;

	// const resource = await generateAudioVoiVo(messageContent, voiceId);

	// await play(convMessage, soundPath);
	// console.log(messageContent);

	// ここまで 旧readMessages.jsの内容
	// ここから 旧generateAudio.jsの内容

	// voicevox音声生成の関数
	async function generateAudioVoiVo(text, speakerName) {
		const audioQueryRes = await rpcVoiceVox.post(`audio_query?text=${encodeURI(text)}&speaker=${speakerName}`, {
			headers: { "accept": "application/json" },
		});

		// 設定を取得
		const audioQuery = setting(audioQueryRes);

		const synthesis = await rpcVoiceVox.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery), {
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

	// aivis音声生成の関数
	async function generateAudioAivis(text, speakerName) {
		const audioQueryRes = await rpcAivis.post(`audio_query?text=${encodeURI(text)}&speaker=${speakerName}`, {
			headers: { "accept": "application/json" },
		});

		const audioQuery = setting(audioQueryRes);

		const synthesis = await rpcAivis.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery), {
			responseType: "arraybuffer",
			headers: {
				"accept": "audio/wav",
				"Content-Type": "application/json",
			},
		});

		return createAudioResource(Readable.from(synthesis.data));
	}

	// 設定取得関数
	function setting(audioQueryRes) {
		const audioQuery = { ...audioQueryRes.data };
		const memberData = userData.get(userId);

		if (memberData?.speed) {
			audioQuery.speedScale = memberData.speed;
		}

		if (memberData?.pitch) {
			audioQuery.pitchScale = memberData.pitch;
		}

		if (memberData?.volume) {
			audioQuery.volumeScale = memberData.volume;
		}

		if (memberData?.intonation) {
			audioQuery.intonationScale = memberData.intonation;
		}

		audioQuery.outputStereo = false;

		return audioQuery;
	}

};