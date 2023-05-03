const router = require('express').Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { Clip } = require('../models/clip')
const { User } = require('../models/user')

/*
* Get all public clips
*/
router.get('/', async (req, res, next) => {
    try {
        const results = await Clip.findAll({ where: { public: true } })
        var clips = []
        results.forEach(element => {
          clips.push({
            title: element.title,
            date: element.createdAt,
            link: `/clips/${element.id}`
          })
        });
        res.status(200).send({
          clips: clips
        })
      } catch {
        res.status(500).send({
          error: "Unable to retrieve videos"
        })
      }
})

/*
* Get Public Clip
*/
router.get('/:clip', jsonParser, async(req, res, next) => {
  try {
    const clip = await Clip.findOne({ where: { id: req.params.clip } })
    if(clip.public){
      res.sendFile(clip.path)
    } else {
      res.status(401).send({
        error: "Unauthorized"
      })
    }
  } catch {
    res.status(500).send({
      error: "Error retrieving file"
    })
  }
})

/*
* Get all of a users public clips
*/
router.get('/user/:user', jsonParser, async(req, res, nect) => {
    try {
      const results = await Clip.findAll({
        attributes: ['id', 'path', 'title', 'createdAt'],
        where : {
          public: true
        },
        include: {
          model: User,
          where: {
            IGN: req.params.user
          },
          attributes: ['firstName', 'lastName', 'IGN']
        }
      });
      var clips = []
      results.forEach(element => {
        clips.push({
          title: element.title,
          date: element.createdAt,
          link: `/clips/${element.id}`
        })
      })
      res.status(200).send({
        clips: clips
      })
    } catch {
      res.status(500).send({
        error: "Unable to retrieve videos"
      })
    }
  })

module.exports = router;