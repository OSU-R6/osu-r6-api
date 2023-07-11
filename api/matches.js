const router = require('express').Router()
const {Op} = require('sequelize');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const {Match} = require('../models/match')
const {Team} = require('../models/team')


/* #####################################################################
/*                        Public Match Endpoints
/* ##################################################################### */

/*
* Get Upcoming Matches
*/
router.get('/upcoming', async(req, res, next) => {
    try {
        const currentDate = new Date();
        const matches = await Match.findAll({ 
            where: {date: {[Op.gt]: currentDate} },
            attributes: ['id', 'description', 'team_id', 'opponent', 'date', 'stream_link'],
            order: [['date', 'ASC']],
            include: [
                {
                  model: Team,
                  attributes: ['name']
                }
            ]
        })
        if(matches.length > 0) {
            res.status(200).send(matches)
        } else {
            res.status(404).send({
                error: "No Upcoming Matches Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Get Upcoming Matches By Team
*/
router.get('/upcoming/:team', async(req, res, next) => {
    try {
        const currentDate = new Date();
        const matches = await Match.findAll({ 
            where: {
                team_id: req.params.team, 
                date: {[Op.gt]: currentDate} 
            },
            attributes: ['id', 'description', 'team_id', 'opponent', 'date', 'stream_link'],
            order: [['date', 'ASC']],
            include: [
                {
                  model: Team,
                  attributes: ['name']
                }
            ]
        })
        if(matches.length > 0) {
            res.status(200).send(matches)
        } else {
            res.status(404).send({
                error: "No Upcoming Matches Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})


/* #####################################################################
/*                        Private Match Endpoints
/* ##################################################################### */

/*
* Create Match
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        if(req.body.description && req.body.date && req.body.team_id && req.body.opponent){
            const matchToCreate = {
                description: req.body.description,
                date: req.body.date,
                team_id: req.body.team_id,
                opponent: req.body.opponent,
                stream_link: req.body.stream_link
            }
            const match = await Match.create(matchToCreate)
            if(match != null){
                res.status(201).send()
            } else {
                res.status(500).send({
                    error: "Error Creating Match"
                })
            }
        } else {
            res.status(400).send({
                error: "Missing 'description', 'date', 'team_id' or 'opponent'"
            }) 
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Delete Match
*/
router.delete('/:id', requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
        Match.destroy({where: {id: req.params.id}})
        res.status(204).send()
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

module.exports = router;