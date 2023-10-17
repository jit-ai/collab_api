const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    delete: _delete,
};

async function create(params) {
    // validate
    if (await db.Favourite.findOne({ where: { user_id: params.user_id, favourite_id: params.favourite_id } })) {
        throw 'This user is already in favourite list.';
    }
    
    // save user
    await db.Favourite.create(params);
}

async function getAll(user) {
    return await db.Favourite.findAll({
        include: [
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'userFavourite' },
        ],where:{user_id:user.id}
    });
}

async function _delete(id,user) {
    const Favourite = await db.Favourite.findAll({where:{user_id:user.id,favourite_id:id}});
    await db.Sequelize.query(`delete from Favourites where user_id=${user.id} and favourite_id=${id}`);
}