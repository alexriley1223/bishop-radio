const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('seek')
		.setDescription('Seek to a time (in seconds) in the current track.')
		.addIntegerOption((option) =>
			option.setName('time').setDescription('Time to seek to').setRequired(true),
		),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		let seekTime = interaction.options.getInteger('time') * 1000;
		const playbackTime = queue.node.playbackTime;

		/* Before start of playback */
		if ((playbackTime + seekTime) < 0) {
			seekTime = 0;
		}

		/* Past end of playback */
		if (playbackTime + seekTime > queue.node.totalDuration) {
			return await interaction.reply({ content: 'Trying to seek too far ahead in the song.', ephemeral: true });
		}

		queue.node.seek(playbackTime + seekTime);

		return await interaction.reply({ content: 'Seeked in song successfully.', ephemeral: true });
	},
});
