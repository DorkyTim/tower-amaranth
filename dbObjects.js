require('dotenv').config();
const config = require('./config.json');
const Sequelize = require('sequelize');

// console.debug(process.env.DATABASE_URL);

const sequelize = (process.env.ENV != 'prod') ?
	new Sequelize(process.env.DATABASE_URL, config.dev) :
	new Sequelize(process.env.DATABASE_URL, config.prod);

const Players = require('./models/Players')(sequelize, Sequelize.DataTypes);
const GeneralShop = require('./models/GeneralShop')(sequelize, Sequelize.DataTypes);
const PlayerItems = require('./models/PlayerItems')(sequelize, Sequelize.DataTypes);

PlayerItems.belongsTo(GeneralShop, { foreignKey: 'item_id', as: 'item' });

/* eslint-disable-next-line func-names */
Players.prototype.addItem = async function(item) {
	const playerItem = await PlayerItems.findOne({
		where: { player_id: this.player_id, item_id: item.id },
	});

	if (playerItem) {
		playerItem.amount += 1;
		return playerItem.save();
	}

	return PlayerItems.create({ player_id: this.player_id, item_id: item.id, amount: 1 });
};

/* eslint-disable-next-line func-names */
Players.prototype.getItems = function() {
	return PlayerItems.findAll({
		where: { player_id: this.player_id },
		include: ['item'],
	});
};

module.exports = { Players, GeneralShop, PlayerItems };
