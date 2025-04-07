"use strict";

// const fs = require("node:fs");
const generateAudio = require("./generateAudio");
const playVoice = require("./playVoice");
const convertMessages = require("./convertMessages");
const convertText = require("./convertText");

module.exports = {
  async playMessage(message) {
    const messageContent = convertMessages(message);
    const audioResource = await generateAudio(messageContent, message.author.id);
    await playVoice(audioResource, message.guild.id);
    // fs.unlinkSync(audioResource);
  },
  async playText(text, guildId) {
    const textContent = convertText(text, guildId);
    const audioResource = await generateAudio(textContent);
    await playVoice(audioResource, guildId);
  },
};