const { Player } = require('discord-player');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { musicChannelId, isModuleEnabled } = require('./config.json');
const { color } = require('@config/bot.json');
const { YoutubeTokens } = require('./token.json');
const package = require('./package.json');
const BishopModule = require('@classes/BishopModule');
const { YoutubeiExtractor } = require('discord-player-youtubei');

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

			player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
			player.extractors.register(YoutubeiExtractor, {
				authentication: YoutubeTokens
			});

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

			player.events.on('playerError', (queue, err) => {
				client.bishop.logger.error('RADI', `Failed to play track: ${err.message}`);
				console.log(err);
			});

			player.events.on('error', (queue, err) => {
				client.bishop.logger.error('RADI', `Generic radio error: ${err.message}`);
				console.log(err);
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