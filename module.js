const { Player } = require('discord-player');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { musicChannelId, isModuleEnabled } = require('./config.json');
const { color } = require('@config/bot.json');
const package = require('./package.json');
const BishopModule = require('@classes/BishopModule');

module.exports = (client) => {
	return new BishopModule({
		name: 'Bishop Radio',
		description: package.description,
		version: package.version,
		enabled: isModuleEnabled,
		author: 'Alex Riley',
		directory: __dirname,
		init: function(client) {
			const player = new Player(client);
			player.extractors.loadDefault();

			/* TODO: Move these to events directory & logic */
			player.events.on('playerStart', (queue, track) => {
				setPresence(client, track);

				const newNowPlaying = new EmbedBuilder()
					.setColor(color)
					.setTitle('🎵  Now Playing')
					.setDescription(`${track.title} by ${track.author} (${track.duration})`)
					.setThumbnail(track.thumbnail)
					.setTimestamp()
					.setFooter({ text: `Requested by: ${track.requestedBy.tag}`, iconURL: `${track.requestedBy.displayAvatarURL({ dynamic: true })}` });

				client.channels.cache.get(musicChannelId).send({ embeds: [newNowPlaying] });
			});
			player.events.on('emptyQueue', () => {
				setTimeout(() => {
					resetPresence(client);
				}, 2000);
			});
			player.events.on('disconnect', () => {
				setTimeout(() => {
					resetPresence(client);
				}, 2000);
			});
			player.events.on('connectionDestroyed', () => {
				setTimeout(() => {
					resetPresence(client);
				}, 2000);
			});
		},
	});
};

function resetPresence(client) {
	client.user.setPresence({
		activities: [{ name: 'These Hands', type: ActivityType.Competing }],
	});
}

function setPresence(client, track) {
	client.user.setPresence({
		activities: [{ name: `${track.title} by ${track.author}`, type: ActivityType.Listening }],
	});
}