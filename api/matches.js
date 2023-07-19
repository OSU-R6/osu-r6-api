const router = require('express').Router()
const {Op} = require('sequelize');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const { Match, Team } = require('../models/index')


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
        const event = Match.build(req.body)
        try {
            await event.validate()
            await event.save()
            res.status(201).send()
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
            error: "Server Error"
        })
    }
})

/*
* Edit Match
*/
router.patch('/:id', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const match = await Match.findByPk(req.params.id)
        if(match != null) {
            match.set(req.body)
            try {
                await match.validate()
                await match.save()
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
                error: "Match Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: err
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