

const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function create(params) {
    // save Category
    await db.Likes.create(params);
}

async function getAll() {
    return await db.Likes.findAll();
}

async function getById(id) {
    return await getLikes(id);
}

async function getLikes(id) {
    const Likes = await db.Likes.findByPk(id);
    if (!Likes) throw 'Category not found';
    return Likes;
}

async function update(id, params) {
    const Likes = await getLikes(id);

    // copy params to user and save
    Object.assign(Likes, params);
    await Likes.save();

    return Likes.get();
}

async function _delete(cid,uid) {
    const Likes = await db.Likes.findAll({where:{userId:uid,collabId:cid}});
    if(Likes.length>0)
    await db.Likes.destroy({where:{userId:uid,collabId:cid}});
    else throw "Data not Found";
}