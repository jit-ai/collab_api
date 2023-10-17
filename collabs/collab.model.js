const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: { type: DataTypes.STRING, allowNull: false },
        artist_id: { type: DataTypes.STRING, allowNull: true },
        I_artist_id: { type: DataTypes.STRING, allowNull: true },
        share_thoughts: { type: DataTypes.TEXT, allowNull: true },
        audio: { type: DataTypes.STRING, allowNull: true },
        hash_tags: { type: DataTypes.STRING, allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true },
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

    return sequelize.define('Collab', attributes, options);
}