const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the currently playing song.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue.size < 1 && queue.repeatMode !== 3) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		queue.node.skip();

		return interaction.reply({ content: 'Current track has been skipped!' });
	},
};
