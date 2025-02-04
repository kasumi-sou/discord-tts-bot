const { Events } = require("discord.js");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.author.bot) {
			return;
		}
		else if (message.content.includes("／(^o^)＼")) {
			await message.channel.send("／(^o^)＼");
		}
		else if (message.content.includes("＼(^o^)／")) {
			await message.channel.send("＼(^o^)／");
		}
		else if (message.content.includes("ｵﾜﾀ")) {
			await message.channel.send("＼(^o^)／ｵﾜﾀ");
		}
		else {return;}
	},
};