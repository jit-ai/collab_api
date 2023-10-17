const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const collabService = require('./collab.service');
const media = require('../_helpers/upload');
const notifService = require('../notifications/notification.service');
const userService = require('../users/user.service');

// routes
router.post('/', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/user/:id', authorize(), getCollabById);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);
router.post('/media', authorize(), uploadFile);
router.post('/create/profileTrack', authorize(), createShareProfileTrackSchema, shareProfileTrack)

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        artist_id: Joi.string().empty(''),
        I_artist_id: Joi.string().empty(''),
        share_thoughts: Joi.string().required(),
        audio: Joi.string().empty(''),
        hash_tags: Joi.string().required(),
        type: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    collabService.create(req.body)
        .then(async () => {
            userService.getAll(req.user).then(async(user) => {
                for (let x of user) {
                    let data = {
                        body: {
                            user_id:x.id,
                            related_user_id: req.body.user_id,
                            message: `${req.user.username} created new collab`,
                            type: "collab"
                        }
                    };
                    await createNotif(data, res, next);
                }
            })
            res.json({ status: 200, message: 'Collab created successfully' });
        })
        .catch(next);
}

function getAll(req, res, next) {
    collabService.getAll(req.user)
        .then(collab => { res.json(collab); })
        .catch(next);
}

function getById(req, res, next) {
    collabService.getById(req.params.id)
        .then(collab => res.json(collab))
        .catch(next);
}

function update(req, res, next) {
    collabService.update(req.params.id, req.body)
        .then(collab => res.json({ status: 200, collab: collab }))
        .catch(next);
}

function _delete(req, res, next) {
    collabService.delete(req.params.id)
        .then(() => res.json({ status: 200, message: 'Collab deleted successfully' }))
        .catch(next);
}

function createShareProfileTrackSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        share_thoughts: Joi.string().required(),
        audio: Joi.string().empty(''),
        hash_tags: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function shareProfileTrack(req, res, next) {
    collabService.shareProfileTrack(req.body)
        .then(() => {
            userService.getAll(req.user).then(async(user) => {
                for (let x of user) {
                    let data = {
                        body: {
                            user_id:x.id,
                            related_user_id: req.body.user_id,
                            message: `${req.user.username} share a profile track collab.`,
                            type: "collab"
                        }
                    };
                    await createNotif(data, res, next);
                }
            })
            res.json({ status: 200, message: 'Collab created successfully' });
        })
        .catch(next);
}

async function uploadFile(req, res, next) {
    const singleUpload = await media.uploadToS3().single('file');
    singleUpload(req, res, function (err) {
        if (err) {
            console.log('c', err);
            return res.status(500).json({ message: err.message });
        }
        console.log('d', req.file);
        res.status(200).send({ fileLocation: req.file.location });
    });
}

async function getCollabById(req, res, next) {
    collabService.getAll(req.user)
        .then(collab => {
            let col = collab.filter((x) => x.user_id == req.params.id)
            res.json(col);
        })
        .catch(next);
}

async function createNotif(req, res, next) {
    notifService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Data created successfully' }))
        .catch(next);
}