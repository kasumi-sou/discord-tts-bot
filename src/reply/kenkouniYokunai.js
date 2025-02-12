module.exports = async function(message) {
	if (message.content.includes("健康によくない") || message.content.includes("健康に良くない")) {
		await message.channel.send({ files: ["https://i.imgur.com/fCAbCPu.png"] });
	}
};