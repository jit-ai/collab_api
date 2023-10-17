const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function create(params) {
    // validate
    if (await db.Festival.findOne({ where: { festival_name: params.festival_name } })) {
        throw 'Name "' + params.festival_name + '" is already taken';
    }
    
    // save user
    await db.Festival.create(params);
}

async function getAll() {
    return await db.Festival.findAll();
}

async function getById(id) {
    return await getFestival(id);
}

async function getFestival(id) {
    const Festival = await db.Festival.findByPk(id);
    if (!Festival) throw 'Festival not found';
    return Festival;
}

async function update(id, params) {
    const festival = await getFestival(id);

    // copy params to user and save
    Object.assign(festival, params);
    await festival.save();

    return festival.get();
}

async function _delete(id) {
    const festival = await getFestival(id);
    await festival.destroy();
}