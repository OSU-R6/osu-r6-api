const router = require('express').Router()
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const { User, Team } = require('../models/index')


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
            attributes: ['id', 'name', 'coach_id', 'captain_id', 'igl_id']
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
            attributes: ['id', 'firstName', 'lastName', 'ign', 'isSubstitute']
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

  /*
* Get Team Info
*/
router.get('/:team/info', async(req, res, next) => {
    try{
        const team = await Team.findByPk(req.params.team, { 
            attributes: ['id', 'name', 'coach_id', 'captain_id', 'igl_id']
        })
        if(team != null) {
            res.status(200).send(team)
        } else {
            res.status(404).send({
                error: "Team Not Found"
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
* Get All Teams
*/
router.get('/all', requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
        const teams = await Team.findAll({
            attributes: ['id', 'active', 'name', 'coach_id', 'captain_id', 'igl_id']
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
* Create Team
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const team = Team.build(req.body)
        try {
            await team.validate()
            await team.save()
            res.status(201).send()
        } catch (err) {
            if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                err = err.errors.map((err) => err.message)
            }
            res.status(400).send({
                error: err
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Edit Team
*/
router.patch('/:team_id', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const team = await Team.findByPk(req.params.team_id)
        if(team != null) {
            team.set(req.body)
            try {
                await team.validate()
                await team.save()
                res.status(200).send()
            } catch (err) {
                if (err.name === 'SequelizeValidationError') {
                    err = err.errors.map((err) => err.message)
                }
                res.status(400).send({
                    error: err
                })
            }
        } else {
            res.status(404).send({
                error: "Team Not Found"
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
* Delete Team
*/
router.delete('/:id', requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
        Team.destroy({where: {id: req.params.id}})
        res.status(204).send()
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})


module.exports = router