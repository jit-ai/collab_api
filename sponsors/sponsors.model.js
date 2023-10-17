const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        sponsors_name: { type: DataTypes.STRING, allowNull: false },
        sponsors_image: { type: DataTypes.STRING, allowNull: true },
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

    return sequelize.define('Sponsors', attributes, options);
}