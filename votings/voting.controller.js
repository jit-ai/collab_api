const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const voteService = require('./voting.service');
const notifService = require('../notifications/notification.service');

// routes
router.post('/', authorize(), voteSchema, vote);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

router.post('/vote_date/', voteDatesSchema, voteDates);
router.get('/vote_date/get', authorize(), getAllDates);
router.get('/vote_date/get/:id', authorize(), getByDatesId);
router.put('/vote_date/update/:id', authorize(), updateDatesSchema,updateDates);
router.delete('/vote_date/delete/:id', authorize(), _deleteDates);

module.exports = router;

function voteSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        artist_id: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function vote(req, res, next) {
    voteService.create(req.body)
        .then(async () => {
            let data = {
                body: {
                    user_id: req.body.artist_id,
                    related_user_id: req.body.artist_id,
                    message: `${req.user.username} voted you`,
                    type: "vote"
                }
            };
            await createNotif(data, res, next);
            res.status(200).json({ status: 200, message: 'Vote successfully' });})
        .catch(next);
}

function getAll(req, res, next) {
    voteService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    voteService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        artist_id: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    voteService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    voteService.delete(req.params.id)
        .then(() => res.json({ message: 'Vote removed successfully' }))
        .catch(next);
}

function voteDatesSchema(req, res, next) {
    const schema = Joi.object({
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function voteDates(req, res, next) {
    voteService.createDates(req.body)
        .then(() => res.status(200).json({ status: 200, message: 'Vote date add successfully' }))
        .catch(next);
}

function getAllDates(req, res, next) {
    voteService.getAllDates()
        .then(users => res.json(users))
        .catch(next);
}

function getByDatesId(req, res, next) {
    voteService.getByDatesId(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateDatesSchema(req, res, next) {
    const schema = Joi.object({
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function updateDates(req, res, next) {
    voteService.updateDates(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _deleteDates(req, res, next) {
    voteService.deleteDates(req.params.id)
        .then(() => res.json({ message: 'Vote removed successfully' }))
        .catch(next);
}

async function createNotif(req, res, next) {
    notifService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Data created successfully' }))
        .catch(next);
}