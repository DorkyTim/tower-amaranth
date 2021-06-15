const Discord = require('discord.js');

const client = new Discord.Client();
const {
	Players,
	GeneralShop,
} = require('./dbObjects');
const {
	Op,
} = require('sequelize');
const currency = new Discord.Collection();
const {
	prefix,
} = require('./config.json');
const {
	token,
} = require('./token.json');

Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.money += Number(amount);
			return user.save();
		}
		const newUser = await Players.create({
			player_id: id,
			money: amount,
		});
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.money : 0;
	},
});

client.once('ready', async () => {
	const storedBalances = await Players.findAll();
	storedBalances.forEach(b => currency.set(b.player_id, b));

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 1);

	if (!message.content.startsWith(prefix)) return;
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

	if (command === 'balance') {
		const target = message.mentions.users.first() || message.author;
		return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)} 💰`);
	} else if (command === 'inventory') {
		const target = message.mentions.users.first() || message.author;
		const player = await Players.findOne({
			where: {
				player_id: target.id,
			},
		});
		const items = await player.getItems();

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);

	} else if (command === 'transfer') {
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
	} else if (command === 'buy') {
		const item = await GeneralShop.findOne({
			where: {
				name: {
					[Op.like]: commandArgs,
				},
			},
		});
		if (!item) return message.channel.send('That item doesn\'t exist.');
		if (item.cost > currency.getBalance(message.author.id)) {
			return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
		}

		const player = await Players.findOne({
			where: {
				player_id: message.author.id,
			},
		});
		currency.add(message.author.id, -item.cost);
		await player.addItem(item);

		message.channel.send(`You've bought: ${item.name}.`);
	} else if (command === 'shop') {
		const items = await GeneralShop.findAll();
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), {
			code: true,
		});
	} else if (command === 'leaderboard') {
		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.player_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.player_id).tag)}: ${user.balance}💰`)
				.join('\n'), {
				code: true,
			},
		);

	}
});

client.login(token);