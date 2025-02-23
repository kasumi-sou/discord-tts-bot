"use strict";

module.exports = async function(message) {
	if (message.content.includes("健康によくない") || message.content.includes("健康に良くない")) {
		await message.channel.send("https://i.imgur.com/fCAbCPu.png");
	}
	if (message.content.includes("そうはならんやろ")) {
		await message.channel.send("https://gyazo.com/a90d3aa5edf71c5e132f72d8a8254ce8/max_size/1000");
	}
};