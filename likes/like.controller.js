
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const likeService = require('./like.service');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/', getAll);
router.get('/:id',authorize(), getById);
router.put('/:id',authorize(), update);
router.delete('/:collabId/:userId',authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        collabId: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    likeService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Likes created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    likeService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    likeService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function update(req, res, next) {
    likeService.update(req.params.id, req.body)
        .then(data => res.json({status:200, data: data}))
        .catch(next);
}

function _delete(req, res, next) {
    likeService.delete(req.params.collabId,req.params.userId)
        .then(() => res.json({status:200, message: 'Data deleted successfully' }))
        .catch(next);
}


