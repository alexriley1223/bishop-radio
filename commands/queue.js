const BishopCommand = require('@classes/BishopCommand');
const { EmbedBuilder } = require('discord.js');
const { color } = require('@config/bot.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the current queue.')
		.addIntegerOption((option) =>
			option.setName('page').setDescription('Page number of the queue'),
		),
	execute: async function(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

		if (!queue?.size) {
			return await interaction.reply({
				content: 'There are no songs in the queue.',
				ephemeral: true,
			});
		}

		let page = interaction.options.getInteger('page', false) ?? 1;
		const perPage = 10;
		const maxPages = Math.ceil(queue.size / perPage);

		// Out of bounds
		if (page < 1 || page > maxPages) {
			page = 1;
		}

		const end = page * perPage;
		const start = end - perPage;

		const tracks = queue.tracks.toArray().slice(start, end);

		const queueEmbed = new EmbedBuilder()
			.setColor(color)
			.setTitle('Current Queue')
			.setDescription(
				`${tracks
					.map(
						(track, i) =>
							`${start + ++i}. [${track.title}](${track.url}) ~ [${track.requestedBy.toString()}]`,
					)
					.join('\n')}`,
			)
			.setFooter({
				text: `Page ${page} of ${maxPages} | track ${start + 1} to ${
					end > queue.size ? `${queue.size}` : `${end}`
				} of ${queue.size}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.reply({ ephemeral: true, embeds: [queueEmbed] });
	},
});
