const { color } = require('@config/bot.json');
const { musicChannelId } = require('../config.json');
const { EmbedBuilder } = require('discord.js');

function sendMusicEmbed(interaction, title, footerText) {
	const musicEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setTimestamp()
        .setFooter({ text: `${footerText}: ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.client.channels.cache.get(musicChannelId).send({ embeds: [musicEmbed] });
}

module.exports = {
    sendMusicEmbed
}