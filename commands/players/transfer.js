/* eslint-disable no-unused-vars */
const { prefix } = require('../../config.json');
module.exports = {
	name: 'transfer',
	description: prefix + 'transfer',
	execute(message, args) {
		const currentAmount = message.client.currency.getBalance(message.author.id);
		const transferAmount = args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

		message.client.currency.add(message.author.id, -transferAmount);
		message.client.currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${message.client.currency.getBalance(message.author.id)}💰`);
	},
};