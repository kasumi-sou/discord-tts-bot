"use strict";

const { Events, MessageFlags } = require("discord.js");


// この辺は公式ガイドと同じ
module.exports = {
  name: Events.InteractionCreate,
  /**
   * @type {(interaction: import("discord.js").Interaction) => Promise<void>}
   */
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }

        try {
          await command.execute(interaction);
        }
        catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
          }
          else {
            await interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
          }
        }
      }
      else if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }

        try {
          await command.autocomplete(interaction);
        }
        catch (error) {
          console.error(error);
        }
      }
    }
    catch (e) { console.error(e); };

  },
};