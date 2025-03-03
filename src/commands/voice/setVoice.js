"use strict";

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

		// コマンド実行者が現在設定中のオプションを取得
		const focusedOption = interaction.options.getFocused(true);

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

		const charaMap = await getChara();

		// 入力情報取得
		const selectedChara = interaction.options.getString("chara");
		const selectedStyle = interaction.options.getString("style");

		// 省略
		const charaObj = charaMap.find(chara => (chara.name === selectedChara));
		const styleObj = charaObj.styles.find(style => (style.name === selectedStyle));
		const styleId = styleObj.id;

		userData.set(memberId, { style: styleId });

		await interaction.reply(`:white_check_mark: キャラクターを **${selectedChara}** の **${selectedStyle}** (id: ${styleId}) に設定しました！`);


	},
};

// APIからキャラ一覧を取得する関数
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