module.exports = function(messageContent) {
	messageContent = messageContent.toLowerCase();

	if (messageContent.match(/^(([lx]?[kstnhmyrwdpfjzvcb]?[yhs]?[aiueo])|n|nn)+$/)) {
		messageContent = romajiToHiragana(messageContent);
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
	if (messageContent.includes("http")) {
		if (messageContent.includes("youtube")) {
			return "ユーチューブのURL";
		}
		if (messageContent.includes("youtu.be")) {
			return "ユーチューブのURL";
		}
		if (messageContent.includes("twitter")) {
			return "ツイッターのURL";
		}
		if (messageContent.includes("x.com")) {
			return "ツイッターのURL";
		}
		return "URL省略";
	}
	if (messageContent.includes("#")) {
		return messageContent.replaceAll("#", "");
	}
	if (messageContent.includes("(φωφ)ﾎﾎｫ…")) {
		return messageContent.replaceAll("(φωφ)ﾎﾎｫ…", "ほほぉ");
	}
	else {return messageContent;}
};

function romajiToHiragana(romaji) {
	let result = romaji;
	[
		["a", "あ"],
		["i", "い"],
		["u", "う"],
		["e", "え"],
		["o", "お"],
		["n", "ん"],
		["ka", "か"],
		["ki", "き"],
		["ku", "く"],
		["ke", "け"],
		["ko", "こ"],
		["sa", "さ"],
		["si", "し"],
		["su", "す"],
		["se", "せ"],
		["so", "そ"],
		["ta", "た"],
		["te", "て"],
		["to", "と"],
		["na", "な"],
		["ni", "に"],
		["nu", "ぬ"],
		["ne", "ね"],
		["no", "の"],
		["ha", "は"],
		["hi", "ひ"],
		["fu", "ふ"],
		["he", "へ"],
		["ho", "ほ"],
		["ma", "ま"],
		["mi", "み"],
		["mu", "む"],
		["me", "め"],
		["mo", "も"],
		["ya", "や"],
		["yu", "ゆ"],
		["yo", "よ"],
		["ra", "ら"],
		["ri", "り"],
		["ru", "る"],
		["re", "れ"],
		["ro", "ろ"],
		["wa", "わ"],
		["wo", "を"],
		["ga", "が"],
		["gi", "ぎ"],
		["gu", "ぐ"],
		["ge", "げ"],
		["go", "ご"],
		["za", "ざ"],
		["zi", "じ"],
		["ji", "じ"],
		["zu", "ず"],
		["ze", "ぜ"],
		["zo", "ぞ"],
		["da", "だ"],
		["di", "ぢ"],
		["du", "づ"],
		["de", "で"],
		["do", "ど"],
		["ba", "ば"],
		["bi", "び"],
		["bu", "ぶ"],
		["be", "べ"],
		["bo", "ぼ"],
		["pa", "ぱ"],
		["pi", "ぴ"],
		["pu", "ぷ"],
		["pe", "ぺ"],
		["po", "ぽ"],
		["la", "ぁ"],
		["li", "ぃ"],
		["lu", "ぅ"],
		["le", "ぇ"],
		["lo", "ぉ"],
		["lya", "ゃ"],
		["lyu", "ゅ"],
		["lyo", "ょ"],
		["ltu", "っ"],
		["ltsu", "っ"],
		["xa", "ぁ"],
		["xi", "ぃ"],
		["xu", "ぅ"],
		["xe", "ぇ"],
		["xo", "ぉ"],
		["xtu", "っ"],
		["xtsu", "っ"],
		["xya", "ゃ"],
		["xyu", "ゅ"],
		["xyo", "ょ"],
		["kya", "きゃ"],
		["kyu", "きゅ"],
		["kyo", "きょ"],
		["sha", "しゃ"],
		["shi", "し"],
		["chi", "ち"],
		["tsu", "つ"],
		["shu", "しゅ"],
		["sho", "しょ"],
		["cha", "ちゃ"],
		["chu", "ちゅ"],
		["cho", "ちょ"],
		["tya", "ちゃ"],
		["tyu", "ちゅ"],
		["tyo", "ちょ"],
		["thi", "てぃ"],
		["dhi", "でぃ"],
		["nya", "にゃ"],
		["nyu", "にゅ"],
		["nyo", "にょ"],
		["hya", "ひゃ"],
		["hyu", "ひゅ"],
		["hyo", "ひょ"],
		["mya", "みゃ"],
		["myu", "みゅ"],
		["myo", "みょ"],
		["rya", "りゃ"],
		["ryu", "りゅ"],
		["ryo", "りょ"],
		["gya", "ぎゃ"],
		["gyu", "ぎゅ"],
		["gyo", "ぎょ"],
		["ja", "じゃ"],
		["ju", "じゅ"],
		["jo", "じょ"],
		["bya", "びゃ"],
		["byu", "びゅ"],
		["byo", "びょ"],
		["pya", "ぴゃ"],
		["pyu", "ぴゅ"],
		["pyo", "ぴょ"],
		["va", "ゔぁ"],
		["vo", "ゔぉ"],
	]
		.reverse()
		.forEach(([r, h]) => {
			result = result.replaceAll(r, h);
		});

	return result.match(/[a-z]+/) ? romaji : result;
}
