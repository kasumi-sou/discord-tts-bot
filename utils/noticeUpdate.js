"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("../config.json");
const updateEmbed = require("./updateEmbed");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});


client.once("ready", async () => {
  sendMessage();
});

const sendMessage = async () => {
  await Promise.all(
    client.guilds.cache.map(async guild => {
      const systemChannel = guild.systemChannel;
      await systemChannel?.send({ embeds: [updateEmbed] })
        .then(() => console.log(`${guild.name}へ送信完了`))
        .catch(err => console.error(`${guild.name}への送信失敗`, err));
    }),
  );
  console.log("処理完了");
  await client.destroy();
};

client.login(token);