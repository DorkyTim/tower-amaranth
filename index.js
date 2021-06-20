const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.currency = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const {
	Players,
	// GeneralShop,
} = require('./dbObjects');
const { prefix } = require('./config.json');
const { token } = require('./token.json');

Reflect.defineProperty(client.currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = client.currency.get(id);
		if (user) {
			user.money += Number(amount);
			return user.save();
		}
		const newUser = await Players.create({
			player_id: id,
			money: amount,
		});
		client.currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(client.currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = client.currency.get(id);
		return user ? user.money : 0;
	},
});

client.once('ready', async () => {
	const storedBalances = await Players.findAll();
	storedBalances.forEach(b => client.currency.set(b.player_id, b));

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.author.bot) return;
	client.currency.add(message.author.id, 1);

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.login(token);