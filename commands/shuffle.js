const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the queue.'),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		if (queue.size < 3) {
			return await interaction.reply({
				content: 'You need at least 3 tracks in the queue to shuffle!',
				ephemeral: true,
			});
		}

		queue.tracks.shuffle();

		sendMusicEmbed(interaction, '🔀  Queue Shuffled', 'Shuffled By');

		return await interaction.reply({ content: 'Queue shuffled successfully.', ephemeral: true });
	},
});
