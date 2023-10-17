

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
    // console.log(db);
    await db.Comments.create(params);
}

async function getAll() {
    return await db.Comments.findAll();
}

async function getById(id) {
    return await getComments(id);
}

async function getComments(id) {
    const Comments = await db.Comments.findAll({include:[{model:db.User,as:'user'}],where:{collabId:id}});
    console.log(Comments);
    if (!Comments) throw 'Comments not found';
    return Comments;
}

async function update(id, params) {
    const Comments = await getComments(id);

    // copy params to user and save
    Object.assign(Comments, params);
    await Comments.save();

    return Comments.get();
}

async function _delete(id) {
    const Comments = await getComments(id);
    await Comments.destroy();
}