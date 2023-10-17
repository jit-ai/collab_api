const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        festival_name: { type: DataTypes.STRING, allowNull: false },
        festival_image: { type: DataTypes.STRING, allowNull: true },
        festival_date: { type: DataTypes.STRING, allowNull: false },
        festival_description: { type: DataTypes.STRING, allowNull: true },
        festival_location: { type: DataTypes.STRING, allowNull: true }
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

    return sequelize.define('Festival', attributes, options);
}