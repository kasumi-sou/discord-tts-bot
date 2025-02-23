"use strict";

module.exports = async function(message) {
	if (message.content.includes("／(^o^)＼")) {
		await message.channel.send("／(^o^)＼");
	}
	else if (message.content.includes("＼(^o^)／")) {
		await message.channel.send("＼(^o^)／");
	}
	else if (message.content.includes("ｵﾜﾀ")) {
		await message.channel.send("＼(^o^)／ｵﾜﾀ");
	}
};