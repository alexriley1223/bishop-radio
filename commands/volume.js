const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Adjust the volume of current playback.')
		.addIntegerOption((option) =>
			option
				.setName('volume')
				.setDescription('The volume to set the music to.')
				.setMinValue(1)
				.setMaxValue(200),
		),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);
		const newVolume = interaction.options.getInteger('volume');

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		if (!newVolume) {
			return await interaction.reply({
				content: `Use /volume <1-200> to adjust the volume. Current volume is ${queue.node.volume}%!`,
				ephemeral: true,
			});
		}

		queue.node.setVolume(newVolume);

		sendMusicEmbed(interaction, `🔊  Playback Volume Changed to ${newVolume}%`, 'Changed By');

		return await interaction.reply({ content: 'Volume changed successfully.', ephemeral: true });
	},
});
