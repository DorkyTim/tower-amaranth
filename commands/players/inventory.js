/* eslint-disable no-unused-vars */
const { prefix } = require('../../config.json');
const { Players } = require('../../dbObjects.js');
module.exports = {
	name: 'inventory',
	description: prefix + 'inventory',
	async execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const player = await Players.findOne({
			where: {
				player_id: target.id,
			},
		});
		const items = await player.getItems();

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
	},
};
