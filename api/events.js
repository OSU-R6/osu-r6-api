const router = require('express').Router()
const {Op} = require('sequelize');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const {requireAuthentication, requireAdmin} = require('../lib/auth')

const { Event, Attendee, User } = require('../models/index')


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
            attributes: ['id', 'title', 'description', 'type', 'date'],
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

/*
* Get Past Events
*/
router.get('/past', async(req, res, next) => {
    try {
        const currentDate = new Date();
        const events = await Event.findAll({ 
            where: {date: {[Op.lt]: currentDate} },
            attributes: ['id', 'title', 'description', 'type', 'date'],
            order: [['date', 'ASC']]
        })
        if(events.length > 0) {
            res.status(200).send(events)
        } else {
            res.status(404).send({
                error: "No past Events Found"
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

/*
* Sign up for Event
*/
router.post('/:id/signup', requireAuthentication, async(req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id)
        if(event != null) {
            const existingAttendenceRecord = await Attendee.findOne({
                where: {event_id: event.id, user_id: req.user},
                paranoid: false
            })
            if(existingAttendenceRecord == null) {
                const attendee = Attendee.build({
                    user_id: req.user,
                    event_id: event.id
                })
                try {
                    await attendee.validate()
                    await attendee.save()
                    res.status(201).send()
                } catch (err) {
                    if (err.name === 'SequelizeValidationError') {
                        err = err.errors.map((err) => err.message)
                    }
                    res.status(400).send({
                        error: err
                    })
                }
            } else {
                if(existingAttendenceRecord.deletedAt != null) {
                    await existingAttendenceRecord.restore()
                    res.status(201).send()
                } else {
                    res.status(400).send({
                        error: "User Already Signed Up"
                    })
                }
            }
        } else {
            res.status(404).send({
                error: "Event Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Cancel Event Signup
*/
router.delete('/:id/signup', requireAuthentication, async(req, res, next) => {
    try{
        await Attendee.destroy({where: {event_id: req.params.id, user_id: req.user}})
        res.status(204).send()
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Check if user is signed up for event
*/
router.get('/:id/signup', requireAuthentication, async(req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id)
        if(event != null) {
            const attendee = await Attendee.findOne({
                where: {event_id: event.id, user_id: req.user}
            })
            if(attendee != null) {
                res.status(200).send()
            } else {
                res.status(404).send({
                    error: "User Not Signed Up"
                })
            }
        } else {
            res.status(404).send({
                error: "Event Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Get Event Attendees
*/
router.get('/:id/attendees', requireAuthentication, requireAdmin, async(req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id)
        if(event != null) {
            const attendees = await Attendee.findAll({
                where: {event_id: event.id},
                attributes: ['user_id', 'createdAt'],
                include: [{
                    model: User,
                    attributes: ['ign', 'firstName', 'lastName']
                }]
            })
            if(attendees.length > 0) {
                res.status(200).send(attendees)
            } else {
                res.status(404).send({
                    error: "No Attendees Found"
                })
            }
        } else {
            res.status(404).send({
                error: "Event Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

module.exports = router