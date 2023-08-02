const router = require('express').Router()
const {Op} = require('sequelize')
const sequelize = require('../lib/sequelize')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User, Invite, Team } = require('../models/index')
const { requireAuthentication, requireAdmin, generateInviteToken} = require('../lib/auth')

/*
* Create user invite token
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
  try{
    const inviteToken = generateInviteToken(req.body.type, req.body.team_id)
    const inviteToCreate = {
      inviter_id: req.user,
      token: inviteToken,
      type: req.body.type,
      team_id: req.body.team_id
    }
    const invite = await Invite.build(inviteToCreate)
    try {
      await invite.validate()
      await invite.save()
      res.status(201).send({
        success: inviteToken
      })
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        err = err.errors.map((err) => err.message)
      }
        res.status(400).send({
        error: err
      })
    }
  } catch (err) {
    res.status(500).send({
      error: err
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
          as: 'team',
          attributes: ['name']
        },
        {
          model: User,
          as: 'inviter',
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
          as: 'team',
          attributes: ['name']
        },
        {
          model: User,
          as: 'inviter',
          attributes: ['ign']
        },
        {
          model: User,
          as: 'invitee',
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
          as: 'team',
          attributes: ['name']
        },
        {
          model: User,
          as: 'inviter',
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
    twentyFourHoursAgo.setHours(currentDate.getHours() - 24)
    const invites = await Invite.destroy({
      where: {
        status: "active",
        invitee_id: null,
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

module.exports = router