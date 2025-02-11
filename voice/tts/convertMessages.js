module.exports = function(messageContent) {
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
	else {return messageContent;}
};