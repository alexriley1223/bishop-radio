const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the queue.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue.size < 3) {
			return await interaction.reply({
				content: 'You need at least 3 tracks in the queue to shuffle!',
				ephemeral: true,
			});
		}

		queue.tracks.shuffle();

		return await interaction.reply({ content: 'Bot playback queue has been shuffled!' });
	},
};
