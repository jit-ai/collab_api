const fs = require('fs');
const AWS = require('aws-sdk');
const util = require("util");
const multer = require('multer');
const multerS3 = require('multer-s3');

// Enter copied or downloaded access ID and secret key here
const ID = 'AKIA4D7RSHDQ7UJ22Z6X';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'collabupload2022';


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadToS3 = function fileUpload() {
    console.log('test');
    return multer({
        storage: multerS3({
            acl: 'public-read',
            s3,
            bucket: BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => {
                console.log('b',file.fieldname);
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, Date.now().toString() + '-' + file.originalname);
            }
        })
    });
};

exports.uploadToS3 = uploadToS3;