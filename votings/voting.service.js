const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllDates,
    getByDatesId,
    createDates,
    updateDates,
    deleteDates:_deleteDates
};

async function getAll() {
    return await db.Voting.findAll();
}

async function getById(id) {
    return await getVoting(id);
}

async function create(params) {
    var isVoted = await db.Sequelize.query(`select Count(id) as voted from Votings where user_id=${params.user_id}`, { type: db.Sequelize.QueryTypes.SELECT });
    if(isVoted[0].voted > 0){
        throw 'Thanks,You are already voted.';
    }
    var data = await db.Sequelize.query(`select Count(id) as voted from Votings where user_id=${params.user_id} and artist_id = ${params.artist_id}`, { type: db.Sequelize.QueryTypes.SELECT });
    console.log(data[0].voted == 0);
    if(data[0].voted > 0){
        throw 'Thanks,You are already voted.';
    }
    await db.Voting.create(params);
}

async function update(id, params) {
    const voting = await getVoting(id);
    Object.assign(user, params);
    await voting.save();

    return voting.get();
}

async function _delete(id) {
    const voting = await getVoting(id);
    await voting.destroy();
}

// helper functions

async function getVoting(id) {
    const voting = await db.Voting.findByPk(id);
    if (!voting) throw 'Vote not found';
    return voting;
}


//date vote
async function getAllDates() {
    return await db.Voting_date.findAll();
}

async function getByDatesId(id) {
    return await getVotingDate(id);
}

async function createDates(params) {
    await db.Voting_date.create(params);
}

async function updateDates(id, params) {
    const Voting_date = await getVotingDate(id);
    Object.assign(Voting_date, params);
    await Voting_date.save();

    return Voting_date.get();
}

async function _deleteDates(id) {
    const Voting_date = await getVotingDate(id);
    await Voting_date.destroy();
}

// helper functions

async function getVotingDate(id) {
    const Voting_date = await db.Voting_date.findByPk(id);
    if (!Voting_date) throw 'Voting date not found';
    return Voting_date;
}