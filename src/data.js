"use strict";

const fs = require("fs");

const guildMap = new Map();
let userMap = new Map();
const dictMap = new Map();

const userPath = "./.data/user.json";
const getGuildDictPath = (guildId) => `./.data/dictionary/${guildId}.json`;

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
  dict: {
    get(guildId) {
      const getDictMap = dictMap.get(guildId);
      if (getDictMap) {
        const dict = Object.freeze(getDictMap);
        return dict;
      }
      else if (fs.existsSync(getGuildDictPath(guildId))) {
        const dictJson = fs.readFileSync(getGuildDictPath(guildId), "utf-8");
        const dict = JSON.parse(dictJson);
        dictMap.set(guildId, dict);
        return Object.freeze(dict);
      }
      else { return []; }
    },
    set(guildId, value) {
      const dict = module.exports.dict.get(guildId);

      const newDict = [...dict.filter(entry => value.every(newEntry => newEntry.word !== entry.word)), ...value];

      const result = dictMap.set(guildId, newDict);
      fs.writeFileSync(getGuildDictPath(guildId), JSON.stringify(newDict), "utf-8");
      return result;
    },
    delete(guildId, word) {
      const dict = module.exports.dict.get(guildId);

      const newDict = [...dict.filter(entry => (word !== entry.word))];
      if (dict.length === newDict.length) {
        return false;
      }

      dictMap.set(guildId, newDict);
      fs.writeFileSync(getGuildDictPath(guildId), JSON.stringify(newDict), "utf-8");

      return true;
    },
  },
};