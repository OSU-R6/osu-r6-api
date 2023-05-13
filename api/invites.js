const router = require('express').Router()
const bcrypt = require('bcrypt')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User, UserSchema } = require('../models/user')
const { Invite } = require('../models/invite')
const { requireAuthentication, requireAdmin, generateInviteToken} = require('../lib/auth')

/*
* Create user invite token
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
        const inviteToken = generateInviteToken()
        const invite = await Invite.create({ creator: req.user, token: inviteToken})
        if(invite != null ){
            res.status(200).send({
                success: inviteToken
            })
        } else {
            res.status(500).send({
                error: "Error Storing Invite"
            })
        }
    } catch (err) {
      res.status(500).send({
        error: "Error Generating Invite"
      })
    }
  })

module.exports = router;