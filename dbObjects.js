const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

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
