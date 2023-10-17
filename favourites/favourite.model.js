const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: { type: DataTypes.STRING, allowNull: false },
        favourite_id: { type: DataTypes.STRING, allowNull: false },
        favourite: { type: DataTypes.ENUM('true', 'false'), defaultValue: 'true' },
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Favourite', attributes, options);
}