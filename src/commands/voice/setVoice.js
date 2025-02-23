const { SlashCommandBuilder, Events } = require("discord.js");
const { default: axios } = require("axios");
const rpc = axios.create({ baseURL: "http://localhost:50021", proxy: false });
const { user: userData } = require("../../data");

module.exports = {
	name: Events.InteractionCreate,

	once: false,
	data: new SlashCommandBuilder()
		.setName("set_voice")
		.setDescription("キャラクターと話し方を選択します")
		.addStringOption((option) => (
			option
				.setName("chara")
				.setDescription("キャラクターを選択してください")
				.setAutocomplete(true)
				.setRequired(true)
		))
		.addStringOption((option) => (
			option
				.setName("style")
				.setDescription("話し方を選択してください")
				.setAutocomplete(true)
				.setRequired(true)
		)),
	/**
   * @type {(interaction: import("discord.js").AutocompleteInteraction) => Promise<void>}
   */
	async autocomplete(interaction) {

		let choices = null;

		// API叩いてキャラ一覧を取得
		const charaMap = await getChara();

		const focusedOption = interaction.options.getFocused(true);

		if (focusedOption.name === "chara") {
			choices = charaMap.map(chara => chara.name);
		}
		else if (focusedOption.name === "style") {
			const selectedChara = interaction.options.getString("chara");
			const styleList = charaMap.find(chara => (chara.name === selectedChara))?.styles || [];
			choices = styleList.map(style => style.name);
		}
		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value)).slice(0, 25);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	/**
   * @type {(interaction: import("discord.js").CommandInteraction) => Promise<void>}
   */
	async execute(interaction) {
		const memberId = interaction.member.id;
		const charaMap = await getChara();

		const selectedChara = interaction.options.getString("chara");
		const selectedStyle = interaction.options.getString("style");

		const charaObj = charaMap.find(chara => (chara.name === selectedChara));
		const styleObj = charaObj.styles.find(style => (style.name === selectedStyle));
		const styleId = styleObj.id;

		userData.set(memberId, { style: styleId });

		await interaction.reply(`:white_check_mark: キャラクターを **${selectedChara}** の **${selectedStyle}** (id: ${styleId}) に設定しました！`);


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