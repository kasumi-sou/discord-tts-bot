"use strict";

const { user: userData } = require("../../data");
const { dict: dictData } = require("../../data");

const romajiConv = require("@koozaki/romaji-conv");

/**
 * convert message to suitable for reading
 * @param {import("discord.js").Message} message input message
 * @returns {string} return message
 */

module.exports = function(message) {
  let messageContent = message.cleanContent.toLowerCase();

  // ローマ字を日本語読み上げ (ex: hoge -> ほげ)
  if (messageContent.match(/^(([lx]?(([kstnhmyrwdpfjzvcbg])\4?)?[yhs]?[aiueo])|n|nn|（）|\(\)|？|\?|-)+[wｗ]*$/)) {
    messageContent = romajiToHiragana(messageContent);
  }

  if (message.attachments.first()) {
    messageContent += "。添付ファイル";
  }


  if (messageContent.indexOf("||") !== messageContent.lastIndexOf("||")) {
    return "ネタバレ";
  }
  if (messageContent.includes("```json")) {
    return "ジェイソンのコード";
  }
  if (messageContent.includes("```js") || messageContent.includes("```javascript")) {
    return "ジャバスクリプトのコード";
  }
  if (messageContent.includes("```java")) {
    return "ジャバのコード";
  }
  if (messageContent.includes("```ts") || messageContent.includes("```typescript")) {
    return "タイプスクリプトのコード";
  }
  if (messageContent.includes("```html")) {
    return "htmlのコード";
  }
  if (messageContent.includes("```css")) {
    return "cssのコード";
  }
  if (messageContent.includes("```c")) {
    return "C言語のコード";
  }
  if (messageContent.includes("```python") || messageContent.includes("```py")) {
    return "パイソンのコード";
  }
  if (messageContent.includes("`") || messageContent.includes("```")) {
    return "コードブロック";
  }
  if (messageContent.includes("http://") || messageContent.includes("https://")) {
    if (messageContent.includes("youtube") || messageContent.includes("youtu.be")) {
      return "ユーチューブのURL";
    }
    if (messageContent.includes("twitter") || messageContent.includes("x.com")) {
      return "ツイッターのURL";
    }
    return "URL省略";
  }

  if (messageContent.includes("#")) {
    if (messageContent.startsWith("#")) {
      // 見出しはシャープと読まれないように
      messageContent = messageContent.replaceAll("#", "");
    }
    messageContent = messageContent.replaceAll("#", "しゃーぷ");
  }

  // ここからユーザー辞書の処理
  const guildId = message.guild.id;
  const dict = dictData.get(guildId);

  if (!dict) {return;}

  const sortedDict = dict.toSorted((a, b) => b.weight - a.weight);
  for (const { word, read } of sortedDict) {
    messageContent = messageContent.replaceAll(word, read);
  }

  messageContent = messageContent
    .replaceAll("(φωφ)ﾎﾎｫ…", "ほほぉ")
    .replaceAll("( ˙꒳​˙  )", "まがお")
    .replaceAll("＃", "しゃーぷ")
    .replaceAll("+", "ぷらす")
    .replaceAll("＋", "ぷらす")
    .replaceAll("™️", "トレードマーク")
    .replaceAll("=", "いこーる")
    .replaceAll("＝", "いこーる")
    .replaceAll("&", "あんど")
    .replaceAll("-", "まいなす")
    .replaceAll("%", "ぱーせんと")
    .replaceAll("％", "ぱーせんと");

  const memberData = userData.get(message.member.id);
  // ずんだ門モード
  if (memberData?.zundamonMode) {
    messageContent += "なのだ！";
  }

  return messageContent;
};

function romajiToHiragana(romaji) {
  const result = romajiConv(romaji).toHiragana();
  return result.match(/[a-vxyz]+/) ? romaji : result;
}
