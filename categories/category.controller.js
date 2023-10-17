const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const categoryService = require('./category.service');
const media = require('../_helpers/upload');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/', getAll);
router.get('/:id',authorize(), getById);
router.put('/:id',authorize(), update);
router.delete('/:id',authorize(), _delete);
router.post('/media',authorize(), uploadFile);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        category_name: Joi.string().required(),
        category_image: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    categoryService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Category created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    categoryService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    categoryService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function update(req, res, next) {
    categoryService.update(req.params.id, req.body)
        .then(data => res.json({status:200, data: data}))
        .catch(next);
}

function _delete(req, res, next) {
    categoryService.delete(req.params.id)
        .then(() => res.json({status:200, message: 'Data deleted successfully' }))
        .catch(next);
}

async function uploadFile(req, res, next) {
    const singleUpload = await media.uploadToS3().single('file');
    singleUpload(req, res, function (err) {
        if (err) {
            console.log('c',err);
            return res.status(500).json({ message: err.message });
        }
        res.status(200).send({ fileLocation: req.file.location });
    });
}
