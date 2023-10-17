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
    await db.Sponsors.create(params);
}

async function getAll() {
    return await db.Sponsors.findAll();
}

async function getById(id) {
    return await getSponsors(id);
}

async function getSponsors(id) {
    const Sponsors = await db.Sponsors.findByPk(id);
    if (!Sponsors) throw 'Sponsors not found';
    return Sponsors;
}

async function update(id, params) {
    const Sponsors = await getSponsors(id);

    // copy params to user and save
    Object.assign(Sponsors, params);
    await Sponsors.save();

    return Sponsors.get();
}

async function _delete(id) {
    const Sponsors = await getSponsors(id);
    await Sponsors.destroy();
}