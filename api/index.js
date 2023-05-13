const router = require('express').Router()

router.use('/users', require('./users'))
router.use('/clips', require('./clips'))
router.use('/invites', require('./invites'))

module.exports = router