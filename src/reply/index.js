const owata = require("./owata.js");
const kenkou = require("./replyImages.js");

module.exports = async function(message) {
	await kenkou(message);
	await owata(message);
};