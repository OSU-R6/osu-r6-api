const router = require('express').Router()
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { Announcement, User } = require('../models/index')
const { requireAuthentication, requireAdmin} = require('../lib/auth')


/* #####################################################################
/*                       Public Announcement Endpoints
/* ##################################################################### */

/*
* Get All Announcements
*/
router.get('/', async(req, res, next) => {
    try{
        const announcements = await Announcement.findAll({ 
            attributes: ['id', 'author_id', 'title', 'body', 'team_id', 'createdAt'],
            include: [{
                model: User,
                attributes: ['ign', 'firstName', 'lastName']
            }],
            order: [['createdAt', 'DESC']]
        })
        if(announcements.length > 0) {
            res.status(200).send(announcements)
        } else {
            res.status(404).send({
                error: "No Announcements Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Get Announcement by ID
*/
router.get('/:announcement', async(req, res, next) => {
    try{
        const announcement = await Announcement.findByPk(req.params.announcement, { 
            attributes: ['id', 'author_id', 'title', 'body', 'team_id', 'createdAt'],
            include: [{
                model: User,
                attributes: ['ign', 'firstName', 'lastName']
            }]
        })
        if(announcement != null) {
            res.status(200).send(announcement)
        } else {
            res.status(404).send({
                error: "Announcement Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})


/* #####################################################################
/*                       Private Announcement Endpoints
/* ##################################################################### */

/*
* Create Announcement
*/
router.post('/', requireAuthentication, requireAdmin, jsonParser, async (req, res, next) => {
    try {
        const announcementToCreate = {
            author_id: req.user,
            title: req.body.title,
            body: req.body.body,
            team_id: req.body.team_id
        }
        const newAnnouncement = Announcement.build(announcementToCreate)
        try {
            await newAnnouncement.validate()
            await newAnnouncement.save()
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
* Edit Announcement
*/
router.patch('/:id', requireAuthentication, requireAdmin, jsonParser, async(req, res, next) => {
    try{
        const announcement = await Announcement.findByPk(req.params.id)
        if(announcement != null){
            announcement.set(req.body)
            try {
                await announcement.validate()
                await announcement.save()
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
                error: "Announcement Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

/*
* Delete Announcement
*/
router.delete('/:id', requireAuthentication, requireAdmin, async(req, res, next) => {
    try{
        const announcement = await Announcement.findByPk(req.params.id)
        if(announcement != null){
            await announcement.destroy()
            res.status(200).send()
        } else {
            res.status(404).send({
                error: "Announcement Not Found"
            })
        }
    } catch (err) {
        res.status(500).send({
            error: "Server Error"
        })
    }
})

module.exports = router