"use strict";
const { Events } = require("discord.js");

module.exports = {
	name: Events.Error,
	once: false,
	execute(e) {
		console.error(e);
	},
};