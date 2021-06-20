/* eslint-disable no-unused-vars */
const { prefix } = require('../../config.json');
const { GeneralShop } = require('../../dbObjects.js');
module.exports = {
	name: 'shop',
	description: prefix + 'shop',
	async execute(message, args) {
		const items = await GeneralShop.findAll();
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), {
			code: true,
		});
	},
};