const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const followerService = require('./favourite.service');
const media = require('../_helpers/upload');
const notifService = require('../notifications/notification.service');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/',authorize(), getAll);
router.delete('/:id',authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        favourite_id: Joi.string().required(''),
        favourite: Joi.string().empty(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    followerService.create(req.body)
        .then(async() => {
            let data = {
                body: {
                    user_id: req.body.favourite_id,
                    related_user_id: req.body.user_id,
                    message: `${req.user.username} added you in favourite list`,
                    type: "favourite"
                }
            };
            await createNotif(data, res, next);
            res.json({ status: 200, message: 'Data created successfully' });})
        .catch(next);
}

function getAll(req, res, next) {
    followerService.getAll(req.user)
        .then(data => res.json(data))
        .catch(next);
}

function _delete(req, res, next) {
    followerService.delete(req.params.id,req.user)
        .then(async() => {
            let data = {
                body: {
                    user_id: req.params.id,
                    related_user_id: req.user.id,
                    message: `${req.user.username} removed you from favourite list`,
                    type: "favourite"
                }
            };
            await createNotif(data, res, next);
            res.json({status:200, message: 'You removed favourite successfully' });})
        .catch(next);
}

async function createNotif(req, res, next) {
    notifService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Data created successfully' }))
        .catch(next);
}