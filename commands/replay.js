const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('replay').setDescription('Replay the current track.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		queue.node.seek(0);

		return await interaction.reply({ content: 'Current track has been replayed!' });
	},
};
