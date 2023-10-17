const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
nodeMailer = require('nodemailer');
const transporter = require('_helpers/mail')(nodeMailer);

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    updateMedia,
    delete: _delete,
    forgotPassword,
    verifyOTP,
    emailValidation,
    getFollow,
    updatePassword
};

async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll(user) {
    return await db.Sequelize.query(`select (select count(id) from Collabs where user_id=A.id) as collab,IFNULL((Select favourite from Favourites where user_id=${user.id} and favourite_id=A.id),'false') as favourite,A.*,(select count(id) from Votings where artist_id = A.id) as Total_Votings,(select (case when (count(id) > 0) then 'true' else 'false' end) from Votings where user_id = ${user.id} and artist_id = A.id) as Is_voted from Users A`, { type: db.Sequelize.QueryTypes.SELECT });
}

async function getById(id,user) {
    // return await getUser(id);
    return db.Sequelize.query(`Select (select count(id) from Collabs where user_id=${id}) as favourite_collab,(select count(id) from Collabs where user_id=B.id) as collab,COUNT(A.id) as followers,(Select COUNT(id) from Followers where follower_id=${id}) as following,(select favourite from Favourites where user_id=${user.id} and favourite_id=${id}) as favourite,B.* from Followers A right outer join Users B on B.id = A.following_id where B.id=${id}`, { type: db.Sequelize.QueryTypes.SELECT });
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    // if (params.password) {
    //     params.hash = await bcrypt.hash(params.password, 10);
    // }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function updateMedia(id, params) {
    const user = await getUser(id);
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    await db.Sequelize.query(`delete from Notifications where user_id = ${id} or related_user_id = ${id}`);
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}

async function forgotPassword(params) {
    // validate
    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    // const token = jwt.sign({ sub: otp }, config.secret, { expiresIn: '1800s' });
    await db.User.update({ otp: otp }, { where: { email: params.email } });
    let mailOptions = {
        from: 'jit.jitendra008@gmail.com', // sender address
        to: params.email, // list of receivers
        name: "John",
        subject: 'OTP Email', // Subject line
        template: 'email', // html body
        context: {
            otp: otp
        }
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        return success;
    });
}

async function verifyOTP(params) {
    // const token = jwt.sign({ sub: params.otp }, config.secret, { expiresIn: '1800s' });
    let us = await db.User.findOne({ where: { otp: params.otp } });
    if (!us) {
        throw 'Otp is invalid.';
    }
    return us;
}

async function emailValidation(params) {
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }
    return true;
}

async function getFollow(user) {
    return await db.Sequelize.query(`Select (select count(id) from Collabs where user_id=${user.id}) as favourite_collab,COUNT(id) as followers,(Select COUNT(id) from Followers where follower_id=${user.id}) as following,(select SUM(if(favourite = 'true',1,0)) from Favourites where user_id=${user.id}) as favourite from Followers where following_id=${user.id}`, { type: db.Sequelize.QueryTypes.SELECT });
}

async function updatePassword(id,params) {
    var user = await db.User.findOne({ where: { id: id } });
    if (user) {
        if (params.password) {
            params.hash = await bcrypt.hash(params.password, 10);
        }
        const user = await getUser(id);
        Object.assign(user, params);
        await user.save();

        return omitHash(user.get());
    } else {
        throw 'Email does not exist.';
    }
}