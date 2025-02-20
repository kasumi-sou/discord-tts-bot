const fs = require("node:fs");

const guildMap = new Map();
let userMap = new Map();
const userPath = "./.data/user.json";

if (!fs.existsSync("./.data")) {
	fs.mkdirSync("./.data");
}
else if (fs.existsSync(userPath)) {
	const userJson = JSON.parse(fs.readFileSync(userPath, "utf-8"));
	userMap = new Map(userJson);
}
module.exports = {
	guild: {
		get(key) {
			return Object.freeze(guildMap.get(key));
		},
		has(key) {
			return guildMap.has(key);
		},
		set(key, value) {
			if ((typeof value !== "object") || !value) {
				throw new Error("value should be an object!");
			}
			const settings = guildMap.get(key) ?? {};
			const result = guildMap.set(key, { ...settings, ...value });
			return result;
		},
		delete(key) {
			return guildMap.delete(key);
		},
	},
	user: {
		get(key) {
			return Object.freeze(userMap.get(key));
		},
		has(key) {
			return userMap.has(key);
		},
		set(key, value) {
			if ((typeof value !== "object") || !value) {
				throw new Error("value should be an object");
			}
			const settings = userMap.get(key) ?? {};
			const result = userMap.set(key, { ...settings, ...value });
			const userArray = Array.from(userMap.entries());
			fs.writeFileSync(userPath, JSON.stringify(userArray), "utf-8");
			return result;
		},
	},
};