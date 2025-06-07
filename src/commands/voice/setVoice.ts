"use strict";

const { SlashCommandBuilder, Events } = require("discord.js");
const { default: axios } = require("axios");
const rpcVoiceVox = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const rpcAivis = axios.create({ baseURL: "http://localhost:10101", proxy: false });
const { user: userData } = require("../../data");

module.exports = {
  name: Events.InteractionCreate,

  once: false,
  data: new SlashCommandBuilder()
    .setName("set_voice")
    .setDescription("キャラクターと話し方を選択します")
    .addStringOption((option) => (
      option
        .setName("engine")
        .setNameLocalizations({
          ja: "エンジン",
        })
        .setDescription("読み上げエンジンを選択します (代表的なキャラクター: VoiceVox: 四国めたん,ずんだもん など)")
        .addChoices(
          { name: "VoiceVox", value: "voiceVox" },
          { name: "AivisSpeech", value: "aivis" },
        )
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName("chara")
        .setNameLocalizations({
          ja: "キャラクター",
        })
        .setDescription("キャラクターを選択してください")
        .setAutocomplete(true)
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName("style")
        .setNameLocalizations({
          ja: "話し方",
        })
        .setDescription("話し方を選択してください")
        .setAutocomplete(true)
        .setRequired(true)
    )),
  /**
   * @type {(interaction: import("discord.js").AutocompleteInteraction) => Promise<void>}
   */
  async autocomplete(interaction) {


    // 以下でAPI叩いてキャラ一覧を取得
    // voicevoxとaivisで条件分岐
    const selectedEngine = interaction.options.getString("engine");

    const charaMap = selectedEngine === "voiceVox" ? await getCharaVoiVo() : selectedEngine === "aivis" ? await getCharaAivis() : null;

    // コマンド実行者が現在設定中のオプションを取得
    const focusedOption = interaction.options.getFocused(true);

    let choices = null;

    if (focusedOption.name === "chara") {
      // キャラを設定中だったら
      // 配列を生成, 要素をオブジェクトからキャラ名に変更
      // 取得できる元のオブジェクトはAPI見て
      choices = charaMap.map(chara => chara.name);
    }
    else if (focusedOption.name === "style") {
      // スタイルを設定中だったら
      const selectedChara = interaction.options.getString("chara");
      // 上で選択されたキャラネーム名に当てはまるキャラのオブジェクトを検索
      const styleList = charaMap.find(chara => (chara.name === selectedChara))?.styles || [];
      // 当てはまったキャラオブジェの中にあるスタイル一覧の配列を生成
      choices = styleList.map(style => style.name);
    }

    // djsの仕様上25までしか選択肢を表示できないので最初から25個のみを表示
    const filtered = choices.filter(choice => choice.startsWith(focusedOption.value)).slice(0, 25);

    // choicesがnullやundefinedのときはスルー
    if (!choices || choices.length === 0) {return;}
    await interaction.respond(
      // 一つ上で作った配列を返す
      filtered.map(choice => ({ name: choice, value: choice })),
    );
  },
  /**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
  async execute(interaction) {
    const memberId = interaction.member.id;

    // 入力情報取得
    const selectedChara = interaction.options.getString("chara");
    const selectedStyle = interaction.options.getString("style");
    const selectedEngine = interaction.options.getString("engine");

    const charaMap = selectedEngine === "voiceVox" ? await getCharaVoiVo() : selectedEngine === "aivis" ? await getCharaAivis() : null;
    const charaObj = charaMap.find(chara => (chara.name === selectedChara));
    const styleObj = charaObj.styles.find(style => (style.name === selectedStyle));
    const styleId = styleObj.id;

    userData.set(memberId, { style: styleId });

    await interaction.reply(`:white_check_mark: キャラクターを **${selectedChara}** の **${selectedStyle}** (id: ${styleId}) に設定しました！`);

    // 以下指定モデルをロード
    if (!styleId) {return;};

    const styleIdDigit = styleId.toString().length;

    if (styleIdDigit <= 2) {
      await rpcVoiceVox.post(`initialize_speaker?speaker=${styleId}&skip_reinit=true`, {
        headers: { "accept": "application/json" },
      });
    }
    else {
      await rpcAivis.post(`initialize_speaker?speaker=${styleId}&skip_reinit=true`, {
        headers: { "accept": "application/json" },
      });
    }
    console.log(`model loaded ${styleId}`);
  },
};

// APIからキャラ一覧を取得する関数
let charaCacheVoiVo = null;
async function getCharaVoiVo() {
  if (charaCacheVoiVo) {return charaCacheVoiVo;}
  const coreVersions = await rpcVoiceVox.get("core_versions", {
    heders: {
      "accept": "application/json",
    },
  });
  // console.log(coreVersions.data.toString());
  const speakerList = await rpcVoiceVox.get(`speakers?core_version=${coreVersions.data.toString()}`, {
    heders: {
      "accept": "application/json",
    },
  });
  // console.log(speakerList.data);
  return charaCacheVoiVo = speakerList.data;
};

let charaCacheAivis = null;
async function getCharaAivis() {
  if (charaCacheAivis) {return charaCacheAivis;}
  const coreVersions = await rpcAivis.get("core_versions", {
    heders: {
      "accept": "application/json",
    },
  });
  // console.log(coreVersions.data.toString());
  const speakerList = await rpcAivis.get(`speakers?core_version=${coreVersions.data.toString()}`, {
    heders: {
      "accept": "application/json",
    },
  });
  // console.log(speakerList.data);
  return charaCacheAivis = speakerList.data;
};