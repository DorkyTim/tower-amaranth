/* eslint-disable no-unused-vars */
const { prefix } = require('../../config.json');
module.exports = {
	name: 'balance',
	description: prefix + 'balance',
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		return message.channel.send(`${target.tag} has ${message.client.currency.getBalance(target.id)} 💰`);
	},
};