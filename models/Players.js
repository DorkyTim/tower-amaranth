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
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		exp: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		race: {
			type: DataTypes.STRING,
			defaultValue: 'human',
			allowNull: false,
		},
		class: {
			type: DataTypes.STRING,
			defaultValue: 'noob',
			allowNull: false,
		},
		subclass: {
			type: DataTypes.STRING,
			defaultValue: 'none',
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};