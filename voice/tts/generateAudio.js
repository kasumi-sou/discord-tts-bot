const fs = require("node:fs");
const rpc = axios.create({ baseURL: "http://voicevox-engine:50021/", proxy: false });

module.exports = async function generateAudio(text, filePath, voice) {
	const audioQuery = await rpc.post(`audio_query?text=${encodeURI(text)}&speaker=${voice}, ${{
		headers: { "accept" : "application/json" },
	}}`);

	const synthesis = await rpc.post(`synthesis?speaker=${voice}, ${JSON.stringify(audioQuery.data)}, ${{
		responseType: "arraybuffer",
		headers: {
			"accept" : "audio/wav",
			"Content-Type" : "appication/json",
		},
	}}`);
	fs.writeFileSync(filePath, new Buffer.from(synthesis.data), "binary");
};