const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause bot if currently playing audio'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		if (queue.node.isPaused()) {
			return interaction.reply({ content: 'Bot is already paused!', ephemeral: true });
		}

		queue.node.pause();

		sendMusicEmbed(interaction, '⏸  Playback Has Been Paused', 'Paused By');

		return await interaction.reply({ content: 'Bot paused successfully.', ephemeral: true });
	},
};
