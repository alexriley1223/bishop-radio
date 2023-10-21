const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop audio bot if currently playing audio.'),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		queue.delete();

		sendMusicEmbed(interaction, '⏹  Playback Has Been Stopped', 'Stopped By');

		return await interaction.reply({ content: 'Bot stopped successfully.', ephemeral: true });
	},
});
