module.exports = async function(message) {
	if (message.content.includes("健康によくない") || message.content.includes("健康に良くない")) {
		await message.channel.send({ files: ["https://media.discordapp.net/attachments/957153432526000189/1338960239692873798/kenkouni_yokunai.png?ex=67acfb65&is=67aba9e5&hm=b8804ff66df089ac6e19d183beddb15cd8f0c3b5cecd1c0cb7f863adcd3da0ca&=&format=webp&quality=lossless"] });
	}
};