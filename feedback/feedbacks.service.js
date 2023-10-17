const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    var feedback=[];
    // return await db.Feedback.findAll({ include: { model: db.User,as: 'user' }});
    let fb = await db.Sequelize.query("select * from Feedbacks", { type: db.Sequelize.QueryTypes.SELECT });
    let user = await db.Sequelize.query("select B.* from Feedbacks A left outer join Users B on A.user_id = B.id", { type: db.Sequelize.QueryTypes.SELECT });
    for(let x=0;x<fb.length;x++){
        feedback.push({
            id: await fb[x].id,
            user_id: await fb[x].user_id,
            rating: await fb[x].rating,
            suggestion: await fb[x].suggestion,
            comment: await fb[x].comment,
            createdAt: await fb[x].createdAt,
            updatedAt: await fb[x].updatedAt,
            user: await user[x]
        });
    }
    return feedback;
}

async function getById(id) {
    return await getFeedback(id);
}

async function create(params) {
    await db.Feedback.create(params);
}

async function update(id, params) {
    const Feedback = await getFeedback(id);
    Object.assign(Feedback, params);
    await Feedback.save();

    return Feedback.get();
}

async function _delete(id) {
    const Feedback = await getFeedback(id);
    await Feedback.destroy();
}

// helper functions

async function getFeedback(id) {
    const Feedback = await db.Feedback.findByPk(id);
    if (!Feedback) throw 'Feedback not found';
    return Feedback;
}