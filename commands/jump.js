const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { sendMusicEmbed } = require('../helpers/embed.js');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Jump to a track without removing others in the way')
		.addIntegerOption((option) =>
			option.setName('index').setDescription('Track index to jump to.').setRequired(true),
		),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		
		if (queue == null || queue?.size < 1) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		const index = interaction.options.getInteger('index', true) - 1;

		if (index > queue?.size || index < 0) {
			return interaction.reply({ content: 'Not a valid queue index.', ephemeral: true });
		}

		const jumpToName = `${queue.tracks.at(index).title} by ${queue.tracks.at(index).author}`;

		queue.node.jump(index);

		sendMusicEmbed(interaction, `↪  Jumped to Queue Item #${index + 1} - ${jumpToName}`, 'Jumped By');

		return await interaction.reply({ content: `Jump successful!`, ephemeral: true });
	},
};
