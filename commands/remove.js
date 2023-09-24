const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove a track from the queue.')
		.addIntegerOption((option) =>
			option
				.setName('index')
				.setDescription('Track index to remove. Use /queue to check.')
				.setRequired(true),
		),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null || queue?.size < 1) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		const index = interaction.options.getInteger('index', true) - 1;

		if (index > queue.size || index < 0) {
			return interaction.reply({ content: 'Not a valid queue index.', ephemeral: true });
		}

		const removeName = `${queue.tracks.at(index).title} by ${queue.tracks.at(index).author}`;

		queue.node.remove(index);

		sendMusicEmbed(interaction, `⏏  Removed ${removeName}`, 'Removed By');

		return interaction.reply({ content: `Removed track successfully.`, ephemeral: true });
	},
};
