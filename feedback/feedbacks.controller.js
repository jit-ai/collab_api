const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Service = require('./feedbacks.service');
const notifService = require('../notifications/notification.service');

// routes
router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        rating: Joi.string().empty(''),
        suggestion: Joi.string().empty(''),
        comment: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    Service.create(req.body)
        .then(async () => {
            res.status(200).json({ status: 200, message: 'Feedback created successfully.' });
        })
        .catch(next);
}

function getAll(req, res, next) {
    Service.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    Service.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        rating: Joi.string().empty(''),
        suggestion: Joi.string().empty(''),
        comment: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    Service.update(req.params.id, req.body)
        .then(data => res.json(data))
        .catch(next);
}

function _delete(req, res, next) {
    Service.delete(req.params.id)
        .then(() => res.json({ message: 'Feedback delete successfully.' }))
        .catch(next);
}