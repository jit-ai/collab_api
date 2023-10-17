const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    getdetails
};

async function create(params) {
    // validate
    if (await db.Follower.findOne({ where: { follower_id: params.follower_id, following_id: params.following_id } })) {
        throw 'You are already following.';
    }
    
    // save user
    await db.Follower.create(params);
}

async function getAll() {
    return await db.Follower.findAll({
        include: [
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'userFollower' },
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'userFollowing' },
        ]
    });
}

async function getById(id) {
    return await getFollower(id);
}

async function getFollower(id) {
    const Follower = await db.Follower.findByPk(id);
    if (!Follower) throw 'Data not found';
    return Follower;
}

async function update(id, params) {
    const Follower = await getFollower(id);

    // copy params to user and save
    Object.assign(Follower, params);
    await Follower.save();

    return Follower.get();
}

async function _delete(id,user) {
    const Follower = await db.Follower.findAll({where:{follower_id:user.id,following_id:id}});
    await db.Sequelize.query(`delete from Followers where follower_id=${user.id} and following_id=${id}`);
}

async function getdetails(user){
    const followers = await db.Sequelize.query(`select B.* from Followers A left outer join Users B on A.follower_id = B.id where A.following_id = ${user.id}`, { type: db.Sequelize.QueryTypes.SELECT });
    const followings = await db.Sequelize.query(`select B.* from Followers A left outer join Users B on A.following_id = B.id where A.follower_id = ${user.id}`, { type: db.Sequelize.QueryTypes.SELECT });
    const total = await db.Sequelize.query(`Select COUNT(id) as followers,(Select COUNT(id) from Followers where follower_id=${user.id}) as following from Followers where following_id=${user.id}`, { type: db.Sequelize.QueryTypes.SELECT });
    return {total:total,followers:followers,followings:followings};
    
}