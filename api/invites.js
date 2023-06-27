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
    if(req.body.team_id != null){
      if(req.body.is_sub != null) {
        const inviteToken = generateInviteToken(req.body.team_id, req.body.is_sub)
        const invite = await Invite.create({ creator_id: req.user, token: inviteToken, team_id: req.body.team_id})
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
          error: "Substitute Status Not Specified"
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