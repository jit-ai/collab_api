
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const commentsService = require('./comments.service');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/', getAll);
router.get('/:id',authorize(), getById);
router.put('/:id',authorize(), update);
router.delete('/:id',authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        collabId: Joi.string().empty(),
        comment: Joi.string().empty(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    commentsService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Comments created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    commentsService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    commentsService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function update(req, res, next) {
    commentsService.update(req.params.id, req.body)
        .then(data => res.json({status:200, data: data}))
        .catch(next);
}

function _delete(req, res, next) {
    commentsService.delete(req.params.id)
        .then(() => res.json({status:200, message: 'Data deleted successfully' }))
        .catch(next);
}


