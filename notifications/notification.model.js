const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        related_user_id:{ type: DataTypes.INTEGER, allowNull: false },
        message: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('unread', 'read'), defaultValue: 'unread' },
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

    return sequelize.define('Notification', attributes, options);
}