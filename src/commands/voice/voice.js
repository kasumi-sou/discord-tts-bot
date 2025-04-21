"use strict";

const { Events, SlashCommandBuilder } = require("discord.js");
const { default: axios } = require("axios");
const rpcVoiceVox = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const rpcAivis = axios.create({ baseURL: "http://localhost:10101", proxy: false });
const { user: userData } = require("../../data");
module.exports = {
  name: Events.InteractionCreate,
  once: false,
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("現在設定中のキャラクターと話し方を取得します"),
  /**
   * @type {(interaction: import("discord.js").AutocompleteInteraction) => Promise<void>}
   */
  async execute(interaction) {
    const memberId = interaction.member.id;

    if (userData.has(memberId)) {
      const styleId = userData.get(memberId).style;
      const charaMap = await getChara(styleId);
      const charaObj = charaMap.find(chara => chara.styles.find(style => (style.id === styleId)));
      const styleObj = charaObj.styles.find(style => (style.id === styleId));
      const charaName = charaObj.name;
      const styleName = styleObj.name;

      await interaction.reply(`:hugging: 現在設定中のキャラクターは **${charaName}** の **${styleName}** (id: ${styleId}) です！`);

    }
    else {
      await interaction.reply("設定が登録されていません");
    }
  },
};


let charaCache = null;
async function getChara(styleId) {
  if (charaCache) {return charaCache;}
  const styleIdDigit = styleId.toString().length;
  if (styleIdDigit <= 2) {
    const coreVersions = await rpcVoiceVox.get("core_versions", {
      heders: {
        "accept": "application/json",
      },
    });
    const speakerList = await rpcVoiceVox.get(`speakers?core_version=${coreVersions.data.toString()}`, {
      heders: {
        "accept": "application/json",
      },
    });
    return charaCache = speakerList.data;
  }
  else if (styleIdDigit > 2) {
    const coreVersions = await rpcAivis.get("core_versions", {
      heders: {
        "accept": "application/json",
      },
    });
    const speakerList = await rpcAivis.get(`speakers?core_version=${coreVersions.data.toString()}`, {
      heders: {
        "accept": "application/json",
      },
    });
    return charaCache = speakerList.data;
  }
};