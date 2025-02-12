module.exports = function(messageContent) {
	messageContent = messageContent.toLowerCase();
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