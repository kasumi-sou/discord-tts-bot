const { debugMode } = require("../config.json");

module.exports = {
  log(log) {
    if (debugMode) {
      console.log(new Date().toISOString(), log);
    }
  },
};