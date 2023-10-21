const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the currently playing song.'),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		if (queue.size < 1 && queue.repeatMode !== 3) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		queue.node.skip();

		sendMusicEmbed(interaction, '⏭  Current Track Skipped', 'Skipped By');

		return await interaction.reply({ content: 'Track skipped successfully.', ephemeral: true });
	},
});
