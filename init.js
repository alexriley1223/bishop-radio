const { Player } = require('discord-player');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { musicChannelId, isModuleEnabled } = require('./config.json');
const { color } = require('@config/bot.json');
const package = require('./package.json');

module.exports = function(client) {
	const module = {};

	module.name = 'Bishop Radio';
	module.description = package.description;
	module.version = package.version;
	module.enabled = isModuleEnabled;

	module.init = function init() {
		const player = new Player(client);
		player.extractors.loadDefault();

		player.events.on('playerStart', (queue, track) => {
			setPresence(track);

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
				resetPresence();
			}, 2000);
		});
		player.events.on('disconnect', () => {
			setTimeout(() => {
				resetPresence();
			}, 2000);
		});

		player.events.on('connectionDestroyed', () => {
			setTimeout(() => {
				resetPresence();
			}, 2000);
		});
	};

	function resetPresence() {
		client.user.setPresence({
			activities: [{ name: 'These Hands', type: ActivityType.Competing }],
		});
	}

	function setPresence(track) {
		client.user.setPresence({
			activities: [{ name: `${track.title} by ${track.author}`, type: ActivityType.Listening }],
		});
	}

	return module;
};
