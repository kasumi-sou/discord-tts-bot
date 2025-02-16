const fs = require("node:fs");

let guildMap = new Map();
let userMap = new Map();
const guildPath = "./.data/guild.json";
const userPath = "./.data/user.json";

if (!fs.existsSync("./.data")) {
	fs.mkdirSync("./.data");
}
else {
	if (fs.existsSync(guildPath)) {
		const guildJson = JSON.parse(fs.readFileSync(guildPath, "utf-8"));
		guildMap = new Map(guildJson);
	}
	if (fs.existsSync(userPath)) {
		const userJson = JSON.parse(fs.readFileSync(userPath, "utf-8"));
		userMap = new Map(userJson);
	}
}
module.exports = {
	guild: {
		get(key) {
			return guildMap.get(key);
		},
		has(key) {
			return guildMap.has(key);
		},
		set(key, value) {
			const result = guildMap.set(key, value);
			const guildArray = Array.from(guildMap.entries());
			fs.writeFileSync(guildPath, JSON.stringify(guildArray), "utf-8");
			return result;
		},
	},
	user: {
		get(key) {
			return userMap.get(key);
		},
		has(key) {
			return userMap.has(key);
		},
		set(key, value) {
			const result = userMap.set(key, value);
			const userArray = Array.from(userMap.entries());
			fs.writeFileSync(userPath, JSON.stringify(userArray), "utf-8");
			return result;
		},
	},
};