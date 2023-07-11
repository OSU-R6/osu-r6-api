const router = require('express').Router()
const {Op} = require('sequelize')
const sequelize = require('../lib/sequelize')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { Invite } = require('../models/invite')
const { User } = require('../models/user')
const { Team } = require('../models/team')
const { requireAuthentication, requireAdmin, generateInviteToken} = require('../lib/auth')

/*
* Create user invite token
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
  try{
    if(req.body.team_id != null){
      if(req.body.is_sub != null) {
        const inviteToken = generateInviteToken(req.body.team_id, req.body.is_sub)
        const invite = await Invite.create({ creator_id: req.user, token: inviteToken, team_id: req.body.team_id, is_sub: req.body.is_sub})
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

/*
* Get All Active Invites
*/
router.get('/active', requireAuthentication, requireAdmin, async(req, res, next) => {
  try {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(currentDate.getHours() - 24);
    const invites = await Invite.findAll({
      where: {
        status: "active",
        createdAt: {[Op.gt]: twentyFourHoursAgo}
      },
      include: [
        {
          model: Team,
          attributes: ['name']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['ign']
        }
      ]
    })
    if(invites.length > 0){
      res.status(200).send(invites)
    } else {
      res.status(404).send({
        error: "No Active Invites Found"
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: "Server Error"
    })
  }
})


/*
* Get All Inactive Invites
*/
router.get('/inactive', requireAuthentication, requireAdmin, async(req, res, next) => {
  try {
    const invites = await Invite.findAll({
      where: {
        status: "inactive"
      },
      include: [
        {
          model: Team,
          attributes: ['name']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['ign']
        },
        {
          model: User,
          as: 'InvitedUser',
          attributes: ['ign']
        }
      ]
    })
    if(invites.length > 0){
      res.status(200).send(invites)
    } else {
      res.status(404).send({
        error: "No Inactive Invites Found"
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: "Server Error"
    })
  }
})

/*
* Get All Expired Invites
*/
router.get('/expired', requireAuthentication, requireAdmin, async(req, res, next) => {
  try {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(currentDate.getHours() - 24);
    const invites = await Invite.findAll({
      where: {
        status: "active",
        createdAt: {[Op.lt]: twentyFourHoursAgo}
      },
      include: [
        {
          model: Team,
          attributes: ['name']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['ign']
        }
      ]
    })
    if(invites.length > 0){
      res.status(200).send(invites)
    } else {
      res.status(404).send({
        error: "No Expired Invites Found"
      })
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

/*
* Purge Expired Invites
*/
router.delete('/expired', requireAuthentication, requireAdmin, async(req, res, next) => {
  try {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(currentDate.getHours() - 24);
    const invites = await Invite.destroy({
      where: {
        status: "active",
        used_by_id: null,
        createdAt: {[Op.lt]: twentyFourHoursAgo}
      }
    })
    res.status(204).send()
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

module.exports = router;