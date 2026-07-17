"use strict";

const { Events, ActivityType } = require("discord.js");
const { setTimeout: sleep } = require("timers/promises");
const { version } = require("../../package.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    try {
      // 起動中は常に実行 10秒間隔で変更
      while (true) {

        await client.user.setActivity({
          name: "✅ /joinで参加",
          type: ActivityType.Custom,
        });
        await sleep(10000);

        await client.user.setActivity({
          name: `🎉 v${version}! 新機能は/helpから`,
          type: ActivityType.Custom,
        });
        await sleep(10000);

        await client.user.setActivity({
          name: "✅ オープンソースbot",
          type: ActivityType.Custom,
        });
        await sleep(10000);
      }
  }catch (e) {
    console.error(e);
  }
  },
};
