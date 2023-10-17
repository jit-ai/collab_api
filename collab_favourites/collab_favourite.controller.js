const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const collabfollowerService = require('./collab_favourite.service');
const media = require('../_helpers/upload');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/',authorize(), getAll);
router.delete('/:id',authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        collab_id: Joi.string().required(''),
        favourite: Joi.string().empty(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    collabfollowerService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Data created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    collabfollowerService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function _delete(req, res, next) {
    collabfollowerService.delete(req.params.id,req.user)
        .then(() => res.json({status:200, message: 'You removed favourite successfully' }))
        .catch(next);
}