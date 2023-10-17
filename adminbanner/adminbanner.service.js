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
    await db.Adminbanner.create(params);
}

async function getAll() {
    return await db.Adminbanner.findAll();
}

async function getById(id) {
    return await getSponsors(id);
}

async function getAdminbanner(id) {
    const Adminbanner = await db.Adminbanner.findByPk(id);
    if (!Adminbanner) throw 'Adminbanner not found';
    return Adminbanner;
}

async function update(id, params) {
    const Adminbanner = await getAdminbanner(id);

    // copy params to user and save
    Object.assign(Adminbanner, params);
    await Adminbanner.save();

    return Adminbanner.get();
}

async function _delete(id) {
    const Adminbanner = await getAdminbanner(id);
    await Adminbanner.destroy();
}