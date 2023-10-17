const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const sponsorsService = require('./sponsors.service')
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
        sponsors_name: Joi.string().required(),
        sponsors_image: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    sponsorsService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Sponsor created successfully' }))
        .catch(next);
        console.log('dfdgfg');
}

function getAll(req, res, next) {
    sponsorsService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    sponsorsService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function update(req, res, next) {
    sponsorsService.update(req.params.id, req.body)
        .then(data => res.json({status:200, data: data}))
        .catch(next);
}

function _delete(req, res, next) {
    sponsorsService.delete(req.params.id)
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
