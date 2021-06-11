const Discord = require('discord.js');
const { prefix } = require('./config.json');
const token = require('./token.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);

client.on('message', message => {
	if (message.content === `${prefix}ping`) {
		message.channel.send('Pong.');
	}
	else if (message.content === `${prefix}beep`) {
		message.channel.send('Boop.');
	}
	else if (message.content === `${prefix}server`) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	}
});