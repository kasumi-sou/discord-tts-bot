const { SlashCommandBuilder } = require("discord.js");
const { data } = require("../utility/ping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Google検索をします"),
}