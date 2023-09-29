const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const { getParentDirectoryString } = require('@helpers/utils');
const { color } = require('@config/bot.json');
const { commands } = require('../config.json');

module.exports = {
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('playback')
    .setDescription('View information about the current playback.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if(queue == null) {
			return await interaction.reply({ content: 'Bot is currently not playing any audio.', ephemeral: true });
		}

        const track = queue.currentTrack;

        const showPlaybackEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle('💿  Currently Playing')
            .setDescription(`${track.title} by ${track.author}\n${queue.node.createProgressBar()}`)
            .setThumbnail(track.thumbnail)
            .setTimestamp()
            .setFooter({ text: `Requested by: ${track.requestedBy.tag}`, iconURL: `${track.requestedBy.displayAvatarURL({ dynamic: true })}` });

        return await interaction.reply({ embeds: [showPlaybackEmbed], ephemeral: true });
	},
};
