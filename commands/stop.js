const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop audio bot if currently playing audio.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		queue.delete();

		return await interaction.reply({ content: 'Bot playback has been stopped!' });
	},
};
