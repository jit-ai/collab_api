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
    await db.Category.create(params);
}

async function getAll() {
    return await db.Category.findAll();
}

async function getById(id) {
    return await getCategory(id);
}

async function getCategory(id) {
    const Category = await db.Category.findByPk(id);
    if (!Category) throw 'Category not found';
    return Category;
}

async function update(id, params) {
    const Category = await getCategory(id);

    // copy params to user and save
    Object.assign(Category, params);
    await Category.save();

    return Category.get();
}

async function _delete(id) {
    const Category = await getCategory(id);
    await Category.destroy();
}