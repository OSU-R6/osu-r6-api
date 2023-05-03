const multer = require('multer')
const crypto = require('crypto')


/*
* Permitted file types
*/
const fileTypes = {
    'video/mp4' : 'mp4'
}


/*
* Multer upload
*/
const upload = multer({
storage: multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, `${__dirname}/../api/uploads`)
    },
    filename: function (req, file, cb) {
    const ext = fileTypes[file.mimetype]
    const filename = crypto.pseudoRandomBytes(16).toString('hex')
    cb(null, `${filename}.${ext}`)
    }
}),
fileFilter: function (req, file, cb) {
    cb(null, !!fileTypes[file.mimetype])
},
limits: { fileSize: 10 * 1024 * 1024 }
})
exports.upload = upload


/*
* Multer error catch middleware
*/
function multerErrorCatch(err, req, res, next) {
if (err instanceof multer.MulterError) {
    res.status(400).json({ error: 'File must be under 10MB' });
} else {
    next(err);
}
}
exports.multerErrorCatch = multerErrorCatch

