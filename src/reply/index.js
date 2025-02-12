const owata = require("./owata.js");
const replyImages = require("./replyImages.js");

module.exports = async function(message) {
	await replyImages(message);
	await owata(message);
};