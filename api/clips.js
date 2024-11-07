const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { Clip } = require('../models/clip')
const { User } = require('../models/user')
const { requireAuthentication, allowAthentication } = require('../lib/auth')
const { videoUpload, multerErrorCatch} = require('../lib/multer')
const { generateUploadURL } = require('../lib/s3')


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
            link: element.path
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
      const filePath = path.join(__dirname, '/uploads/player-clips/', clip.path)
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
* Upload user clip to AWS S3
*/
router.get('/uploadurl/:filename', jsonParser, requireAuthentication, async(req, res, next) => {
  try{ 
    await generateUploadURL(req.params.filename).then((url) => {
      console.log(url)
      res.status(200).send({
        url: url
      })
    }).catch((err) => {
      res.status(500).send({
        error: "Error Generating Upload URL 1"
      })
    })
  } catch {
    res.status(500).send({
      error: "Error Generating Upload URL 2"
    })
  }
})

/*
* Create Clip
*/
router.post('/', jsonParser, requireAuthentication, async(req, res, next) => {
  try{
    uploadObject = {
      title: req.body.title,
      user_id: req.user,
      path: req.body.path
    }
    console.log(uploadObject)
    console.log(req.body)
    const newUpload = await Clip.create(uploadObject)
    if(newUpload != null){
      res.status(201).send({
        title: newUpload.title,
        public: newUpload.public,
        date: newUpload.createdAt,
        link: newUpload.path
      })
    } else {
      res.status(500).send({
        error: "Error Uploading Video"
      })
    }
  } catch(err) {
    res.status(500).send({
      error: err
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
          await Clip.destroy({ where: { id : req.params.clip } })
          res.status(204).send()
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