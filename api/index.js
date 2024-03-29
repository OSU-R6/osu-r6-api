const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/users', require('./users'))
router.use('/clips', require('./clips'))
router.use('/invites', require('./invites'))
router.use('/prospects', require('./prospects'))
router.use('/teams', require('./teams'))
router.use('/matches', require('./matches'))
router.use('/events', require('./events'))
router.use('/announcements', require('./announcements'))

module.exports = router