const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const notifService = require('./notification.service');
const media = require('../_helpers/upload');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/',authorize(), getAll);
router.delete('/:id',authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        related_user_id: Joi.string().required(),
        message: Joi.string().required(''),
        type: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    notifService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Data created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    notifService.getAll(req.user)
        .then(data => res.json(data))
        .catch(next);
}

function _delete(req, res, next) {
    notifService.delete(req.params.id)
        .then(() => res.json({status:200, message: 'notification marked read.' }))
        .catch(next);
}

exports.createNotif = create;