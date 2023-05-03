const router = require('express').Router()

router.use('/users', require('./users'))
router.use('/clips', require('./clips'))

module.exports = router