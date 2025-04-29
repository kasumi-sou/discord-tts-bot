"use strict";

const { EmbedBuilder } = require("discord.js");
const { version } = require("../package.json");
module.exports = new EmbedBuilder()
  .setColor(0xffdbed)
  .setTitle(`:tada: アップデート ${version}`)
  .setDescription(`${version}にアップデートされました！新機能の一部をご紹介します！\n追加のコマンドや大きな変更はありません。\n詳細は以下をご覧ください。\nhttps://github.com/kasumi-sou/discord-tts-bot/releases/v${version}`);
/*
  .addFields(
    { name: "\n", value: "\n" },
    { name: "読み上げの声をいろいろ設定できます。", value: "```/set_...```" },
    { name: "読み上げ辞書を設定します。", value: "```/set_dictionary```" },
    { name: "読み上げ辞書を削除します。", value: "```/remove_dictionary```" },
    { name: "読み上げ辞書を登録します。", value: "```/import_dictionary```" },
    { name: "登録済の読み上げ辞書を出力します。", value: "```/export_dictionary```" },
    { name: "登録済の読み上げ辞書を表示します。", value: "```/dictionary```" },
    { name: "Google検索をします。", value: "```/google```" },
    { name: "BOTをホストしているサーバーの情報を表示。", value: "```/sys_info```" },
    { name: "\n", value: "\n" },
    { name: "その他の更新についてはこちらをご覧ください！", value: `https://github.com/kasumi-sou/discord-tts-bot/releases/v${version}` },
  );*/
