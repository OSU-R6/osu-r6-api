const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/users', require('./users'))
router.use('/clips', require('./clips'))
router.use('/invites', require('./invites'))
router.use('/teams', require('./teams'))
router.use('/matches', require('./matches'))
router.use('/events', require('./events'))

module.exports = router