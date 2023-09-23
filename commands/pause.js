const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause bot if currently playing audio.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (queue.node.isPaused()) {
			return interaction.reply({ content: 'Bot is already paused!', ephemeral: true });
		}
		queue.node.pause();

		return await interaction.reply({ content: 'Bot has been paused!' });
	},
};
