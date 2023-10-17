const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const competitionService = require('./competition.service');

// routes
router.post('/',authorize(), createSchema, create);
router.get('/', getAll);
router.get('/:id',authorize(), getById);
router.put('/:id',authorize(), update);
router.delete('/:id',authorize(), _delete);


module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        competition_description: Joi.string().required(),
        media: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    competitionService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Competition created successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    competitionService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    competitionService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function update(req, res, next) {
    competitionService.update(req.params.id, req.body)
        .then(data => res.json({status:200, data: data}))
        .catch(next);
}

function _delete(req, res, next) {
    competitionService.delete(req.params.id)
        .then(() => res.json({status:200, message: 'Data deleted successfully' }))
        .catch(next);
}

// async function uploadFile(req, res, next) {
//     const singleUpload = await media.uploadToS3().single('file');
//     singleUpload(req, res, function (err) {
//         if (err) {
//             console.log('c',err);
//             return res.status(500).json({ message: err.message });
//         }
//         res.status(200).send({ fileLocation: req.file.location });
//     });
// }
