const router = require('express').Router()
const {Op} = require('sequelize');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const {Event} = require('../models/event');
const e = require('express');


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
        const event = Event.build(req.body)
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
* Edit Event
*/
router.patch('/:id', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id)
        if(event != null) {
            event.set(req.body)
            try {
                await event.validate()
                await event.save()
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
                error: "Event Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: err
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