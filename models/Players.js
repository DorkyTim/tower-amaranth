module.exports = (sequelize, DataTypes) => {
	return sequelize.define('players', {
		player_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		money: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};