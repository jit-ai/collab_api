const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function create(params) {
    // save competition
    // console.log(db);
    await db.Competition.create(params);
}

async function getAll() {
    return await db.Competition.findAll();
}

async function getById(id) {
    return await getCompetition(id);
}

async function getCompetition(id) {
    const Competition = await db.Competition.findByPk(id);
    if (!Competition) throw 'Competition not found';
    return Competition;
}

async function update(id, params) {
    const Competition = await getCompetition(id);

    // copy params to user and save
    Object.assign(Competition, params);
    await Competition.save();

    return Competition.get();
}

async function _delete(id) {
    const Competition = await getCompetition(id);
    await Competition.destroy();
}