const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('clear').setDescription('Clear the queue of all songs.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue.size < 2) {
			return await interaction.reply({ content: 'The queue is already empty!', ephemeral: true });
		}

		queue.tracks.clear();

		return await interaction.reply({ content: 'Bot playback queue has been cleared!' });
	},
};
