const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    delete: _delete,
};

async function create(params) {
    // validate
    if (await db.Collab_Favourite.findOne({ where: { user_id: params.user_id, collab_id: params.collab_id } })) {
        throw 'This collab is already in favourite list.';
    }
    
    // save user
    await db.Collab_Favourite.create(params);
}

async function getAll() {
    return await db.Collab_Favourite.findAll({
        include: [
            { attributes: ['id', 'user_id', 'artist_id', 'I_artist_id', 'share_thoughts', 'audio','hash_tags','type'], model: db.Collab, as: 'collabFavourite' },
        ]
    });
}

async function _delete(id,user) {
    const Collab_Favourite = await db.Collab_Favourite.findAll({where:{user_id:user.id,collab_id:id}});
    await db.Sequelize.query(`delete from Collab_Favourites where user_id=${user.id} and collab_id=${id}`);
}