const multer = require('multer')
const crypto = require('crypto')


/*
* Permitted file types
*/
const videoFileTypes = {
    'video/mp4' : 'mp4'
}
const imageFileTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png'
}


/*
* Multer upload
*/
const videoUpload = multer({
storage: multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, `${__dirname}/../api/uploads/player-clips`)
    },
    filename: function (req, file, cb) {
    const ext = videoFileTypes[file.mimetype]
    const filename = crypto.pseudoRandomBytes(16).toString('hex')
    cb(null, `${filename}.${ext}`)
    }
}),
fileFilter: function (req, file, cb) {
    cb(null, !!videoFileTypes[file.mimetype])
},
limits: { fileSize: 50 * 1024 * 1024 }
})
exports.videoUpload = videoUpload


/*
* Multer image upload
*/
const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, `${__dirname}/../api/uploads/profile-images`)
        },
        filename: function (req, file, cb) {
        const ext = imageFileTypes[file.mimetype]
        const filename = crypto.pseudoRandomBytes(16).toString('hex')
        cb(null, `${filename}.${ext}`)
        }
    }),
    fileFilter: function (req, file, cb) {
        cb(null, !!imageFileTypes[file.mimetype])
    },
    limits: { fileSize: 2 * 1024 * 1024 }
    })
    exports.imageUpload = imageUpload


/*
* Multer error catch middleware
*/
function multerErrorCatch(err, req, res, next) {
if (err instanceof multer.MulterError) {
    res.status(415).json({ error: 'Video files must be under 50MB. Image Files Must be under 2MB' });
} else {
    next(err);
}
}
exports.multerErrorCatch = multerErrorCatch

