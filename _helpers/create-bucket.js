const AWS = require('aws-sdk');

// Enter copied or downloaded access ID and secret key here
const ID = 'AKIA4D7RSHDQ7UJ22Z6X';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'collabupload2022';


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "eu-west-1"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});