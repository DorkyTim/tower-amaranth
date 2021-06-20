/* eslint-disable no-unused-vars */
const fs = require('fs');
const { prefix } = require('../../config.json');
module.exports = {
	name: 'commands',
	description: prefix + 'commands',
	execute(message, args) {
		const commandFolders = fs.readdirSync('./commands');
		const commands = new Map;

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../${folder}/${file}`);
				commands.set(command.name, command.description);
			}
		}
		// console.debug(commands);
		return message.channel.send([...commands.entries()], { code:true });
	},
};