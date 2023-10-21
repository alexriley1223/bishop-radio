const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('clear').setDescription('Clear the queue of all songs.'),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null || queue?.size < 1) {
			return await interaction.reply({ content: 'The queue is already empty!', ephemeral: true });
		}

		queue.tracks.clear();

		sendMusicEmbed(interaction, '🧹  Queue Has Been Cleared', 'Cleared By');

		return await interaction.reply({ content: 'Queue cleared successfully.', ephemeral: true });
	},
});
