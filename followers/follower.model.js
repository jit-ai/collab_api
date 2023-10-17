const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        follower_id: { type: DataTypes.STRING, allowNull: false },
        following_id: { type: DataTypes.STRING, allowNull: false },
        favourite: { type: DataTypes.ENUM('true', 'false'), defaultValue: 'false' },
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

    return sequelize.define('Follower', attributes, options);
}