"use strict";

const { dict: dictData } = require("../../data");

module.exports = function(text, guildId) {
  let textContent = text.toLowerCase();

  // ここからユーザー辞書の処理
  const dict = dictData.get(guildId);

  if (!dict) {return;}

  const sortedDict = dict.toSorted((a, b) => b.weight - a.weight);
  for (const { word, read } of sortedDict) {
    textContent = textContent.replaceAll(word, read);
  }
  return textContent;
};