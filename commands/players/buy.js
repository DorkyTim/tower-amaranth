/* eslint-disable no-unused-vars */
const { prefix } = require('../../config.json');
const { Players, GeneralShop } = require('../../dbObjects.js');
const { Op } = require('sequelize');
module.exports = {
	name: 'buy',
	description: prefix + 'buy',
	async execute(message, args) {
		const item = await GeneralShop.findOne({
			where: {
				name: {
					[Op.like]: args,
				},
			},
		});
		if (!item) return message.channel.send('That item doesn\'t exist.');
		if (item.cost > message.client.currency.getBalance(message.author.id)) {
			return message.channel.send(`You currently have ${message.client.currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
		}

		const player = await Players.findOne({
			where: {
				player_id: message.author.id,
			},
		});
		message.client.currency.add(message.author.id, -item.cost);
		await player.addItem(item);

		message.channel.send(`You've bought: ${item.name}.`);
	},
};
