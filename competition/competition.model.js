const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        competition_description: { type: DataTypes.TEXT('long'), allowNull: false },
        media: { type: DataTypes.STRING, allowNull: true },
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

    return sequelize.define('Competition', attributes, options);
}