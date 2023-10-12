const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('replay').setDescription('Replay the current track.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		queue.node.seek(0);

		sendMusicEmbed(interaction, '🔂  Current Track Replayed', 'Replayed By');

		return await interaction.reply({ content: 'Current track replayed succesfully.', ephemeral: true });
	},
};
