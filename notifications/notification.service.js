const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    delete: _delete,
};

async function create(params) {
    // save user
    await db.Notification.create(params);
}

async function getAll(user) {
    return await db.Notification.findAll({where:{user_id:user.id,status:'unread'},
        include: [
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'user' },
            { attributes: ['id', 'username', 'email', 'image', 'usertype', 'gender'], model: db.User, as: 'actionUser' },
        ]
    });
}

async function _delete(id) {
    // const Notification = await db.Notification.findAll({where:{user_id:user.id,favourite_id:id}});
    await db.Sequelize.query(`update Notifications set status = 'read' where id=${id}`);
}