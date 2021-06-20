/* eslint-disable no-unused-vars */
const { prefix } = require('../../config.json');
module.exports = {
	name: 'leaderboard',
	description: prefix + 'leaderboard',
	execute(message, args) {
		console.debug(message.client.users);
		return message.channel.send(
			message.client.currency.sort((a, b) => b.money - a.money)
				.filter(user => message.client.users.cache.has(user.player_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(message.client.users.cache.get(user.player_id).tag)}: ${user.money}💰`)
				.join('\n'), {
				code: true,
			},
		);
	},
};