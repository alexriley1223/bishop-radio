const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume playing bot if currently paused.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not paused.', ephemeral: true });
		}

		if (queue.node.isPlaying()) {
			return interaction.reply({ content: 'Bot is already playing!', ephemeral: true });
		}

		queue.node.resume();

		sendMusicEmbed(interaction, '▶  Playback Has Been Resumed', 'Resumed By');

		return await interaction.reply({ content: 'Bot resumed successfully.', ephemeral: true });
	},
};
