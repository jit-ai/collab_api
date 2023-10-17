const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const festivalService = require('./festival.service');
const media = require('../_helpers/upload');

// routes
router.post('/', createSchema, create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/media', uploadFile);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        festival_name: Joi.string().required(),
        festival_image: Joi.string().empty(''),
        festival_date: Joi.string().required(),
        festival_description: Joi.string().required(),
        festival_location: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    festivalService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Festival created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    festivalService.getAll()
        .then(festivals => res.json(festivals))
        .catch(next);
}

function getById(req, res, next) {
    festivalService.getById(req.params.id)
        .then(festivals => res.json(festivals))
        .catch(next);
}

function update(req, res, next) {
    festivalService.update(req.params.id, req.body)
        .then(festival => res.json({status:200,festival:festival}))
        .catch(next);
}

function _delete(req, res, next) {
    festivalService.delete(req.params.id)
        .then(() => res.json({status:200, message: 'Festival deleted successfully' }))
        .catch(next);
}

async function uploadFile(req, res, next) {
    const singleUpload = await media.uploadToS3().single('file');
    singleUpload(req, res, function (err) {
        if (err) {
            console.log('c',err);
            return res.status(500).json({ message: err.message });
        }
        console.log('d',req.file);
        res.status(200).send({ fileLocation: req.file.location });
    });
    // const file = req.file;
    // file.localFullPath = `http://localhost:5000/uploads/${file?.filename}`;
    // file.liveFullPath = `https://tranquil-lowlands-58854.herokuapp.com/uploads/${file?.filename}`;
    // if (!file) {
    //     return res.status(400).send({ message: 'Please upload a file.' });
    // }
    // return res.send({ message: 'File uploaded successfully.', file });
}
