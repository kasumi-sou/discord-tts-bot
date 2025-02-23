const { Events, SlashCommandBuilder } = require("discord.js");
const { default: axios } = require("axios");
const rpc = axios.create({ baseURL: "http://localhost:50021", proxy: false });
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
			const charaMap = await getChara();
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
async function getChara() {
	if (charaCache) {return charaCache;}
	const coreVersions = await rpc.get("core_versions", {
		heders: {
			"accept": "application/json",
		},
	});
	// console.log(coreVersions.data.toString());
	const speakerList = await rpc.get(`speakers?core_version=${coreVersions.data.toString()}`, {
		heders: {
			"accept": "application/json",
		},
	});
	// console.log(speakerList.data);
	return charaCache = speakerList.data;
};