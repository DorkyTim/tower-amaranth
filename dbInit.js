const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const GeneralShop = require('./models/GeneralShop')(sequelize, Sequelize.DataTypes);
require('./models/Players')(sequelize, Sequelize.DataTypes);
require('./models/PlayerItems')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		GeneralShop.upsert({ name: 'Tea', cost: 1 }),
		GeneralShop.upsert({ name: 'Coffee', cost: 2 }),
		GeneralShop.upsert({ name: 'Cake', cost: 5 }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
