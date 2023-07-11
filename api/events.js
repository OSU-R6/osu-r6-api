const router = require('express').Router()
const {Op} = require('sequelize');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const {Event} = require('../models/event')


/* #####################################################################
/*                        Public Event Endpoints
/* ##################################################################### */

/*
* Get Upcoming Events
*/
router.get('/upcoming', async(req, res, next) => {
    try {
        const currentDate = new Date();
        const events = await Event.findAll({ 
            where: {date: {[Op.gt]: currentDate} },
            attributes: ['id', 'description', 'type', 'date'],
            order: [['date', 'ASC']]
        })
        if(events.length > 0) {
            res.status(200).send(events)
        } else {
            res.status(404).send({
                error: "No Upcoming Events Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})


/* #####################################################################
/*                        Private Event Endpoints
/* ##################################################################### */

/*
* Create Event
*/
router.post('/', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        if(req.body.description && req.body.date && req.body.type){
            const eventToCreate = {
                description: req.body.description,
                date: req.body.date,
                type: req.body.type
            }
            const event = await Event.create(eventToCreate)
            if(event != null){
                res.status(201).send()
            } else {
                res.status(500).send({
                    error: "Error Creating Event"
                })
            }
        } else  {
            res.status(400).send({
                error: "Missing 'description', 'date' or 'type'"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Delete Event
*/
router.delete('/:id', requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
        Event.destroy({where: {id: req.params.id}})
        res.status(204).send()
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

module.exports = router;