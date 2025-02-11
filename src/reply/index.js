const owata = require("./owata.js");
const kenkou = require("./kenkouniYokunai.js");

module.exports = async function(message) {
	await kenkou(message);
	await owata(message);
};