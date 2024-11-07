const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const generateUploadURL = async (fileName) => {
    console.log("Generating upload URL")
    const params = {
        Bucket: 'osu-r6-video',
        Key: fileName,
        Expires: 60, // URL expires in 60 seconds
        ContentType: 'video/mp4'
    }
    return await s3.getSignedUrlPromise('putObject', params)
} 
exports.generateUploadURL = generateUploadURL