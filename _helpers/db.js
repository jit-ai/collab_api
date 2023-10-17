// const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
var path = require("path");
var env = process.env.NODE_ENV || "production";
var config = require(path.join(__dirname, '..', 'config.json'))[env];

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    
    // connect to db
    var sequelize = new Sequelize(config.database, config.user, config.password, config);

    db.Sequelize = sequelize;
    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Category = require('../categories/category.model')(sequelize);
    db.Festival = require('../festivals/festival.model')(sequelize);
    db.Collab = require('../collabs/collab.model')(sequelize);
    db.Sponsors = require('../sponsors/sponsors.model')(sequelize);
    db.Likes = require('../likes/like.model')(sequelize);
    db.Comments = require('../comments/comments.model')(sequelize);
    db.Competition = require('../competition/competition.model')(sequelize);
    db.Follower = require('../followers/follower.model')(sequelize);
    db.Voting = require('../votings/voting.model')(sequelize);
    db.Voting_date = require('../votings/voting_dates.model')(sequelize);
    db.Favourite = require('../favourites/favourite.model')(sequelize);
    db.Adminbanner = require('../adminbanner/adminbanner.model')(sequelize);
    db.Collab_Favourite = require('../collab_favourites/collab_favourite.model')(sequelize);
    db.Notification = require('../notifications/notification.model')(sequelize);
    db.Feedback = require('../feedback/feedbacks.model')(sequelize);

    db.User.hasMany(db.Collab, {foreignKey: 'id'})
    db.Collab.belongsTo(db.User, {as: 'User',foreignKey: 'user_id'})
    db.Collab.belongsTo(db.User, {as: 'Artist',foreignKey: 'artist_id'})
    db.Collab.belongsTo(db.User, {as: 'I_Artist',foreignKey: 'I_artist_id'})
    db.Collab.hasOne(db.Likes, {as: 'Likes',foreignKey: 'collabId',sourceKey: 'id'})

    db.User.hasMany(db.Comments, {foreignKey: 'id'})
    db.Comments.belongsTo(db.User, {as: 'user',foreignKey: 'userId'});

    db.User.hasMany(db.Follower, {foreignKey: 'id'})
    db.Follower.belongsTo(db.User, {as: 'userFollower',foreignKey: 'follower_id'})
    db.Follower.belongsTo(db.User, {as: 'userFollowing',foreignKey: 'following_id'})

    db.User.hasMany(db.Favourite, {foreignKey: 'id'})
    db.Favourite.belongsTo(db.User, {as: 'userFavourite',foreignKey: 'favourite_id'})

    db.Collab.hasMany(db.Collab_Favourite, {foreignKey: 'id'})
    db.Collab_Favourite.belongsTo(db.Collab, {as: 'collabFavourite',foreignKey: 'collab_id'})

    db.User.hasMany(db.Notification, {foreignKey: 'id'})
    db.Notification.belongsTo(db.User, {as: 'user',foreignKey: 'user_id'});
    db.Notification.belongsTo(db.User, {as: 'actionUser',foreignKey: 'related_user_id'});

    // db.User.hasMany(db.Feedback, {foreignKey: 'id'})
    // db.Feedback.belongsTo(db.User, {as: 'user',foreignKey: 'user_id'});

    // sync all models with database
    await sequelize.sync();
}