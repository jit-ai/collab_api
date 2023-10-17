const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        banner_name: { type: DataTypes.STRING, allowNull: false },
        banner_image: { type: DataTypes.STRING, allowNull: true },
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

    return sequelize.define('Adminbanner', attributes, options);
}