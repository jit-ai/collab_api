const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const followerService = require('./follower.service');
const media = require('../_helpers/upload');
const notifService = require('../notifications/notification.service');


// routes
router.post('/',authorize(), createSchema, create);
router.get('/',authorize(), getAll);
router.get('/:id',authorize(), getById);
router.put('/:id',authorize(), update);
router.delete('/:id',authorize(), _delete);
router.get('/details/:id',authorize(), getUserFollowersFollowing);
router.post('/media',authorize(), uploadFile);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        follower_id: Joi.string().required(),
        following_id: Joi.string().required(''),
        favourite: Joi.string().empty(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    followerService.create(req.body)
        .then(async() => {
            let data = {
                body: {
                    user_id: req.body.following_id,
                    related_user_id: req.body.follower_id,
                    message: `${req.user.username} started follwing you`,
                    type: "follow"
                }
            };
            await createNotif(data, res, next);
            res.json({ status: 200, message: 'Data created successfully' });})
        .catch(next);
}

function getAll(req, res, next) {
    followerService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    followerService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function update(req, res, next) {
    followerService.update(req.params.id, req.body)
        .then(data => res.json({status:200,data:data}))
        .catch(next);
}

function _delete(req, res, next) {
    followerService.delete(req.params.id,req.user)
        .then(async() => {
            let data = {
                body: {
                    user_id: req.params.id,
                    related_user_id: req.user.id,
                    message: `${req.user.username} unfollowed you`,
                    type: "follow"
                }
            };
            await createNotif(data, res, next);
            res.json({status:200, message: 'user unfollowed successfully' });})
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
}

function getUserFollowersFollowing(req, res, next) {
    followerService.getdetails(req.user)
        .then((data) => res.json({status:200, data: data }))
        .catch(next);
}

async function createNotif(req, res, next) {
    notifService.create(req.body)
        .then(() => res.json({ status: 200, message: 'Data created successfully' }))
        .catch(next);
}