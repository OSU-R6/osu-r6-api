const router = require('express').Router()

const { User } = require('../models/index')
const { requireAuthentication } = require('../lib/auth')

/*
* Authenticate User With Token
*/
router.get('/', requireAuthentication, async(req, res, next) => {
    try{
        const user = await User.findByPk(req.user, {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        })
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send({
            error: err
        })
    }
})

module.exports = router