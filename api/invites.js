const router = require('express').Router()
const bcrypt = require('bcrypt')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { Invite } = require('../models/invite')
const { requireAuthentication, requireAdmin, generateInviteToken} = require('../lib/auth')

/*
* Create user invite token
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
      if(req.body.team != null){
        const inviteToken = generateInviteToken(req.body.team)
        const invite = await Invite.create({ creator: req.user, token: inviteToken, team: req.body.team})
        if(invite != null ){
            res.status(201).send({
                success: inviteToken
            })
        } else {
            res.status(500).send({
                error: "Error Storing Invite"
            })
        }
      } else {
        res.status(400).send({
          error: "No Team Specified"
      })
      }
    } catch (err) {
      res.status(500).send({
        error: "Error Generating Invite"
      })
    }
  })

module.exports = router;