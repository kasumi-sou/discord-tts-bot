"use strict";

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { google } = require("googleapis");
const customSearch = google.customsearch("v1");

const { engineId } = require("../../../config.json");
const { googleApiKey } = require("../../../config.json");

// 未実装 いつかやる™
// 実装したﾖ
module.exports = {
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Google検索をします")
    .addStringOption((option) => (
      option
        .setName("keyword")
        .setNameLocalizations({
          ja: "キーワード",
        })
        .setDescription("検索するキーワードを入力してください")
        .setRequired(true)
    )),
  async execute(interaction) {
    if (!googleApiKey || !engineId) {
      return await interaction.reply("❌ この機能を使用するには追加の設定が必要です。ボットの管理者にお問い合わせください。\n-# 管理者の方へ GoogleCustomSearchの設定が必要です。詳細は[こちら](https://github.com/kasumi-sou/discord-tts-bot/blob/main/README.md)。");
    }
    const keyword = interaction.options.getString("keyword");

    // googlecustomsearch
    try {
      const result = await customSearch.cse.list({
        auth: googleApiKey,
        cx: engineId,
        q: keyword,
        gl: "jp",
        hl: "ja",
        lr: "lang_ja",
      });

      const resultList = result.data.items;

      const timeOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const nowTime = new Date().toLocaleTimeString("ja-JP", timeOptions);

      // 検索結果リスト
      let description = "";
      if (resultList) {
        resultList.forEach((item) => description += `[${item.title}](${item.link})  \`${item.displayLink}\`\n-# ${item.snippet}\n\n`);
      }
      else {
        description = "キーワードに一致する情報は見つかりませんでした。";
      }


      const resultEmbed = new EmbedBuilder()
        .setColor(0xffdbed)
        .setTitle(`"${keyword}" の検索結果`)
        .setURL(`https://www.google.co.jp/search?q=${encodeURIComponent(keyword)}`)
        .setDescription(description)
        .setFooter({ text: `検索日時:  ${nowTime}`, iconURL: interaction.guild.members.me.displayAvatarURL() });

      await interaction.reply({ embeds: [resultEmbed] });
      // console.log(resultList);

    }
    catch (e) {
      await interaction.reply({ content: ":x: 何らかのエラーが発生しました。", flags: MessageFlags.Ephemeral });
      console.error(e);
    }
  },
};