const router = require('express').Router()
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const {Team} = require('../models/team')
const {User} = require('../models/user')


/* #####################################################################
/*                        Public Team Endpoints
/* ##################################################################### */

/*
* Get Active Team List
*/
router.get('/', async(req, res, next) => {
    try{
        const teams = await Team.findAll({ 
            where: {active: true},
            attributes: ['id', 'name', 'coach_id', 'captain_id']
        })
        if(teams.length > 0) {
            res.status(200).send(teams)
        } else {
            res.status(404).send({
                error: "No Teams Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Get Team Roster
*/
router.get('/:team/roster', async(req, res, next) => {
    try{
        const team = await User.findAll({ 
            where: {team_id: req.params.team},
            attributes: ['id', 'firstName', 'lastName', 'ign']
        })
        if(team.length > 0) {
            res.status(200).send(team)
        } else {
            res.status(404).send({
                error: "No Active Members Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
  })


/* #####################################################################
/*                        Private Team Endpoints
/* ##################################################################### */

/*
* Create Team
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        if(req.body.name != null) {
        const teamToCreate =  {
            name:  req.body.name,
            coach_id: req.body.coach_id,
            captain_id: req.body.captain_id,
            active: req.body.active
        }
        const team = await Team.create(teamToCreate)
        if(team != null) {
            res.status(201).send()
        } else {
            res.status(500).send({
                error: "Error Creating Team"
            })
        }
    } else {
        res.status(400).send({
            error: "Missing name or captain_id"
        })
    }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Change Team Captian
*/
router.patch('/:team_id/captain/:captain_id', requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const team = await Team.update(
            {captain_id: req.params.captain_id},
            {where: {id: req.params.team_id}}
        ) 
        res.status(200).send()
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }    
})

/*
* Change Team Coach
*/
router.patch('/:team_id/coach/:coach_id', requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const team = await Team.update(
            {coach_id: req.params.coach_id},
            {where: {id: req.params.team_id}}
        ) 
        res.status(200).send()
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }    
})


module.exports = router;