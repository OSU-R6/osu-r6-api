const router = require('express').Router()
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { Prospect } = require('../models/index')
const { requireAuthentication, requireAdmin} = require('../lib/auth')


/* #####################################################################
/*                       Public Prospect Endpoints
/* ##################################################################### */

/*
* Create Prospect
*/
router.post('/', jsonParser, async (req, res, next) => {
    try {
        const prospectToCreate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            type: req.body.type,
            rank: req.body.rank,
            experience: req.body.experience,
            competitiveness: req.body.competitiveness,
            commitment: req.body.commitment,
            role: req.body.role,
            discord: req.body.discord,
            uplay: req.body.uplay,
            start: req.body.start,
            notes: req.body.notes
        }
        const newProspect = Prospect.build(prospectToCreate)
        try {
            await newProspect.validate()
            await newProspect.save()
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
        res.status(400).send({
        error: err
        })
    }
})


/* #####################################################################
/*                       Private Prospect Endpoints
/* ##################################################################### */


/*
* Get All Prospects by status
*/
router.get('/:status', requireAuthentication, requireAdmin, async (req, res, next) => {
    try {
        const prospects = await Prospect.findAll({
            where: {
                status: req.params.status
            }
        })
        if(prospects.length > 0) {
          res.status(200).send(prospects)
        } else {
          res.status(404).send({
            error: "No '" + req.params.status + "' Prospects Found"
          })
        }
    } catch (err) {
        res.status(500).send({
          error: "Server Error"
        })
    }
})

/*
Edit Prospect
*/
router.patch('/:prospect', jsonParser, requireAuthentication, requireAdmin, async (req, res, next) => {
try {
    const prospect = await Prospect.findByPk(req.params.prospect)
    if(prospect != null){
        const updatedFields = ['status']
        updatedFields.forEach(field => {
            prospect[field] = req.body[field] || prospect[field]
        })
        try {
            await prospect.validate()
            await prospect.save()
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
            error: "Prospect Not Found"
        })
    }

    } catch (err) {
        console.log(err)
        res.status(500).send({
          error: "Server Error"
        })
    }
})


module.exports = router