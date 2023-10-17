const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, validate: { isEmail: true } },
        password: { type: DataTypes.STRING, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: true },
        media: { type: DataTypes.STRING, allowNull: true },
        usertype: { type: DataTypes.STRING, allowNull: false },
        gender: { type: DataTypes.STRING, allowNull: true },
        age: { type: DataTypes.STRING, allowNull: true },
        country: { type: DataTypes.STRING, allowNull: true },
        state: { type: DataTypes.STRING, allowNull: true },
        category_id: { type: DataTypes.STRING, allowNull: true },
        last_login: { type: DataTypes.DATE },
        status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
        otp: { type: DataTypes.STRING, allowNull: true },
        hash: { type: DataTypes.STRING, allowNull: false },
        hashTag: {type: DataTypes.STRING, allowNull: true},
        comment: {type: DataTypes.STRING, allowNull: true},
        fb_link: {type: DataTypes.STRING, allowNull: true},
        instagram_link: {type: DataTypes.STRING, allowNull: true},
        pintrest_link: {type: DataTypes.STRING, allowNull: true}
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

    return sequelize.define('User', attributes, options);
}