require('dotenv').config();
const config = require('./config.json');
const Sequelize = require('sequelize');

// console.debug(process.env.DATABASE_URL);

const sequelize = (process.env.ENV != 'prod') ?
	new Sequelize(process.env.DATABASE_URL, config.dev) :
	new Sequelize(process.env.DATABASE_URL, config.prod);

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
