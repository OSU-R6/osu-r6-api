const router = require('express').Router()
const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { Clip } = require('../models/clip')
const { User } = require('../models/user')
const { requireAuthentication, allowAthentication } = require('../lib/auth')
const { videoUpload, multerErrorCatch} = require('../lib/multer')


/* #####################################################################
/*                        Public Clip Endpoints
/* ##################################################################### */

/*
* Get all public clips
*/
router.get('/', async (req, res, next) => {
    try {
        const results = await Clip.findAll({ where: { public: true } })
        var clips = []
        results.forEach(element => {
          clips.push({
            id: element.id,
            user_id: element.user_id,
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
* Get Clip
*/
router.get('/:clip', jsonParser, allowAthentication, async(req, res, next) => {
  try { 
    const clip = await Clip.findByPk(req.params.clip)
    if(clip.public || req.user === clip.user_id){
      const filePath = path.join(__dirname, '/uploads/player-clips/', clip.path);
      res.sendFile(filePath)
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


/* #####################################################################
/*                        Private Clip Endpoints
/* ##################################################################### */

/*
* Upload user clip
*/
router.post('/', jsonParser, requireAuthentication, videoUpload.single('video'), multerErrorCatch, async(req, res, next) => {
  try{ 
    if(!req.file) {
      res.status(400).send({
        error: "MP4 File Required"
      })
    } else {
      uploadObject = {
        title: req.body.title,
        user_id: req.user,
        path: req.file.filename
      }
      const newUpload = await Clip.create(uploadObject)
      if(newUpload != null){
        res.status(201).send({
          title: newUpload.title,
          public: newUpload.public,
          date: newUpload.createdAt,
          link: `/clips/GetPrivateClip/${newUpload.id}`
        })
      } else {
        res.status(500).send({
          error: "Error Uploading Video"
        })
      }
    }
  } catch {
    res.status(500).send({
      error: "Error Uploading Video"
    })
  }
})

/*
* Edit Clip
*/
router.patch('/:clip', requireAuthentication, jsonParser, async(req, res, next) => {
  try{
    const clip = await Clip.findByPk(req.params.clip)
    if(clip != null){
      if(clip.user_id == req.user){
        const updatedFields = ['title', 'public', 'spotlight']
        updatedFields.forEach(field => {
          clip[field] = req.body[field] || clip[field]
        })
        try {
          await clip.validate()
          await clip.save()
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
        res.status(401).send({
          error: "Unauthorized"
        })
      }
    } else {
      res.status(404).send({
        error: "Clip Not Found"
      })
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

/*
* Delete Clip
*/
router.delete('/:clip', requireAuthentication, async(req, res, next) => {
  try{
    const clip = await Clip.findByPk(req.params.clip)
    if(clip != null){
      if(clip.user_id == req.user){
        fs.unlink(clip.path, async(err) => {
          if (err) {
            res.status(404).send({
              error: "Error removing clip"
            })
          } else {
            await Clip.destroy({ where: { id : req.params.clip } })
            res.status(204).send()
          }
        })
      } else {
        res.status(401).send({
          error: "Unauthorized"
        })
      }
    } else {
      res.status(404).send({
        error: "Clip Not Found"
      })
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

module.exports = router