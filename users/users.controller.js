const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
const upload = require('../_helpers/imageUpload');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.put('/updatePassword/update/:id',  updatePasswordSchema, updatePassword);
router.put('/addMedia/:id', authorize(), updateMediaSchema, updateMedia);
router.delete('/:id', authorize(), _delete);
router.post('/forgotPassword', forgotPasswordSchema, forgotPassword);
router.post('/otpverify', verifyOTPSchema, verifyOTP);
router.post('/upload', authorize(), uploadFile);
router.post('/email', emailValidationSchema, emailValidation);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json({ status: 200, user: user }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        usertype: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        image: Joi.string().empty(''),
        gender: Joi.string().empty(''),
        age: Joi.string().empty(''),
        country: Joi.string().empty(''),
        state: Joi.string().empty(''),
        category_id: Joi.string().empty(''),
        media: Joi.string().empty(''),
        fb_link: Joi.string().empty(''),
        instagram_link: Joi.string().empty(''),
        pintrest_link: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.status(200).json({ status: 200, message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll(req.user)
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    userService.getFollow(req.user)
        .then(data => {
            req.user.followers = data[0].followers;
            req.user.following = data[0].following;
            req.user.favourite = data[0].favourite;
            res.json(req.user)
        })
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id,req.user)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        usertype: Joi.string().required(),
        username: Joi.string().required(),
        image: Joi.string().empty(''),
        gender: Joi.string().empty(''),
        age: Joi.string().empty(''),
        country: Joi.string().empty(''),
        state: Joi.string().empty(''),
        category_id: Joi.string().empty(''),
        media: Joi.string().empty(''),
        hashTag: Joi.string().empty(''),
        comment: Joi.string().empty(''),
        fb_link: Joi.string().empty(''),
        instagram_link: Joi.string().empty(''),
        pintrest_link: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(''),
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    userService.forgotPassword(req.body)
        .then(mail => res.json({ status: 200, message: 'Email sent to your email address.' }))
        .catch(next);
}

function verifyOTPSchema(req, res, next) {
    const schema = Joi.object({
        otp: Joi.string().required(''),
    });
    validateRequest(req, next, schema);
}

function verifyOTP(req, res, next) {
    userService.verifyOTP(req.body)
        .then(otp => res.json({ status: 200, message: 'Your are successfully varified.',user:otp }))
        .catch(next);
}

function updatePasswordSchema(req, res, next) {
    const schema = Joi.object({
        password: Joi.string().required(''),
    });
    validateRequest(req, next, schema);
}

function updatePassword(req, res, next) {
    userService.updatePassword(req.params.id,req.body)
        .then(() => res.json({ status: 200, message: 'Your password successfully updated.' }))
        .catch(next);
}

async function uploadFile(req, res, next) {
    await upload(req, res);
    const file = req.file;
    if (!file) {
        return res.status(400).send({ status: 400, message: 'Please upload a file.' });
    }
    file.localFullPath = `http://localhost:5000/uploads/${file?.filename}`;
    file.liveFullPath = `https://tranquil-lowlands-58854.herokuapp.com/uploads/${file?.filename}`;
    return res.send({ status: 200, message: 'File uploaded successfully.', file });
}

function emailValidationSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function emailValidation(req, res, next) {
    userService.emailValidation(req.body)
        .then(() => res.json({ status: 200, message: 'Email is valid.' }))
        .catch(next);
}

function updateMediaSchema(req, res, next) {
    const schema = Joi.object({
        media: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function updateMedia(req, res, next) {
    userService.updateMedia(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}