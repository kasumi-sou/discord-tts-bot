"use strict";

// const fs = require("node:fs");
const { default: axios } = require("axios");
const rpcVoiceVox = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const rpcAivis = axios.create({ baseURL: "http://localhost:10101", proxy: false });
const { createAudioResource } = require("@discordjs/voice");
const { Readable } = require("node:stream");
const { user: userData } = require("../../data");
const { log } = require("../../debug");


module.exports = async function readMessages(messageContent, userId) {
  try {
  // const soundPath = `sounds/${message.author.id}.wav`;
  // const soundPath = `sounds/${message.id}.wav`;
  // const defaultVoice = "14";

    let styleId = userData.get(userId)?.style;
    // 6は四国めたん
    const defaultVoice = "6";

    // voiceIdがない場合(そもそも設定してない or 入退出通知のときはデフォルトボイス)
    if (!styleId) {styleId = defaultVoice;}
    const styleIdDigit = styleId.toString().length;

    // voicevox使用かaivis使用かはidの桁数で判定
    if (styleIdDigit <= 2) {
    // voiceIdが2桁以下、すなわちvoicevoxのキャラidが指定されている場合voicevoxで音声生成
      const resource = await generateAudioVoiVo(messageContent, styleId);
      log(`generatedAudio(voiceVox): ${messageContent}`);
      // console.log(messageContent);
      return resource;
    }
    else if (styleIdDigit > 2) {
    // voiceIdが二桁より大きい(aivisのキャラidは9桁?)場合はaivisで音声生成
      const resource = await generateAudioAivis(messageContent, styleId);
      log(`generatedAudio(aivis): ${messageContent}`);
      // console.log(messageContent);
      return resource;
    }

  }
  catch (e) {
    console.error(e);
    return null;
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

    log("executed: rpcVoiceVox.post(audioQuery)");

    // 設定を取得
    const audioQuery = setting(audioQueryRes);
    log("executed: setting(voiceVox)");

    const synthesis = await rpcVoiceVox.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery), {
      responseType: "arraybuffer",
      headers: {
        "accept": "audio/wav",
        "Content-Type": "application/json",
      },
    });

    log("executed: rpcVoiceVox.post(synthesis)");

    // fs.writeFileSync(filePath, new Buffer.from(synthesis.data), "binary");
    // return filePath;
    const auidioResource = createAudioResource(Readable.from(synthesis.data));
    log("executed: createAudioResource(voiceVox)");
    return auidioResource;
  }

  // aivis音声生成の関数
  async function generateAudioAivis(text, speakerName) {
    const audioQueryRes = await rpcAivis.post(`audio_query?text=${encodeURI(text)}&speaker=${speakerName}`, {
      headers: { "accept": "application/json" },
    });

    log("executed: rpcAivis.post(audioQuery)");

    const audioQuery = setting(audioQueryRes);
    log("executed: setting(aivis)");

    const synthesis = await rpcAivis.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery), {
      responseType: "arraybuffer",
      headers: {
        "accept": "audio/wav",
        "Content-Type": "application/json",
      },
    });

    log("executed: rpcAivis.post(synthesis)");

    createAudioResource(Readable.from(synthesis.data));
    const auidioResource = createAudioResource(Readable.from(synthesis.data));
    log("executed: createAudioResource(aivis)");
    return auidioResource;
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