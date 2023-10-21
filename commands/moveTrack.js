const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('movetrack')
		.setDescription('Move a track in the queue')
		.addIntegerOption((option) =>
			option
				.setName('from')
				.setDescription('Track index to move. Use /queue to check.')
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName('to').setDescription('Track index to move to.').setRequired(true),
		),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null || queue?.size < 3) {
			return interaction.reply({
				content: 'The queue needs at least 3 tracks to use this command.',
				ephemeral: true,
			});
		}

		// Remove one since we're adding +1 in queue
		const from = interaction.options.getInteger('from', true) - 1;
		const to = interaction.options.getInteger('to', true) - 1;

		if (from < 0 || from >= queue.size) {
			return interaction.reply({ content: 'Provided \'from\' is not valid.', ephemeral: true });
		}
		if (to < 0 || to >= queue.size) {
			return interaction.reply({ content: 'Provided \'to\' is not valid.', ephemeral: true });
		}
		if (from === to) {
			return interaction.reply({
				content: 'The track is already in this position.',
				ephemeral: true,
			});
		}

		const fromName = `${queue.tracks.at(from).title} by ${queue.tracks.at(from).author}`;

		queue.node.move(from, to);

		sendMusicEmbed(interaction, `↪  Moved ${fromName} to Position #${to + 1} In The Queue`, 'Moved By');

		return await interaction.reply({ content: 'Moved track successfully.', ephemeral: true });
	},
});
