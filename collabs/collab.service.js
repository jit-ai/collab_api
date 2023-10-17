const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    shareProfileTrack
};

async function create(params) {
    // save collab
    await db.Collab.create(params);
}

async function getAll(user) {
    const collabInterface = [];
    let collab = await db.Collab.findAll({
        include: [
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'User' },
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'Artist' },
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'I_Artist' },
            // { model: db.Likes, as: 'Likes', attributes:['id'] },
        ]
    });
    if (collab) {
        for (let x of collab) {
            let sub = await db.Sequelize.query(`select count(collabId) as Likes from Likes where collabId = ${x.id}`, { type: db.Sequelize.QueryTypes.SELECT });
            let userLiked = await db.Sequelize.query(`select Users.* from Likes left outer join Users on Likes.userId = Users.id where Likes.userId = ${user.id} and Likes.collabId = ${x.id}`, { type: db.Sequelize.QueryTypes.SELECT });
            let follow = await db.Sequelize.query(`Select * from Followers where follower_id=${user.id} and following_id=${x.user_id}`, { type: db.Sequelize.QueryTypes.SELECT });
            let favourite = await db.Sequelize.query(`Select * from Collab_Favourites where user_id=${user.id} and collab_id=${x.id}`, { type: db.Sequelize.QueryTypes.SELECT });

            collabInterface.push({
                id:x.id,
                user_id:x.user_id,
                artist_id:x.artist_id,
                I_artist_id:x.I_artist_id,
                share_thoughts:x.share_thoughts,
                audio:x.audio,
                type:x.type,
                createdAt:x.createdAt,
                updatedAt:x.updatedAt,
                User:x.User,
                Artist:x.Artist,
                I_Artist:x.I_Artist,
                I_Artist:x.I_Artist,
                hash_tags:x.hash_tags,
                Likes:await sub[0].Likes,
                Following: follow.length > 0 ? true : false,
                IsLiked:userLiked.length>0 ? true : false,
                IsFavourite:favourite.length>0 ? true : false
            });
        }
        return collabInterface;
    }
}
async function getById(id) {
    return await getCollab(id);
}
async function getCollab(id) {
    const Collab = await db.Collab.findByPk(id);
    if (!Collab) throw 'Collab not found';
    return Collab;
}
async function update(id, params) {
    const Collab = await getCollab(id);

    // copy params to user and save
    Object.assign(Collab, params);
    await Collab.save();

    return Collab.get();
}

async function _delete(id) {
    const Collab = await getCollab(id);
    await Collab.destroy();
}

async function shareProfileTrack(params){
    // save collab
    await db.Collab.create(params);
}