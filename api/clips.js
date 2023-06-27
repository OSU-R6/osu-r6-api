const router = require('express').Router()
const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { Clip } = require('../models/clip')
const { User } = require('../models/user')
const { requireAuthentication } = require('../lib/auth')
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
            title: element.title,
            date: element.createdAt,
            link: `/GetPublicClip/${element.id}`
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
router.get('/GetPublicClip/:clip', jsonParser, async(req, res, next) => {
  try {
    const clip = await Clip.findByPk(req.params.clip)
    if(clip.public){
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

/*
* Get all of a users public clips
*/
router.get('/GetPublicClips/:user', jsonParser, async(req, res, nect) => {
    try {
      const results = await Clip.findAll({
        attributes: ['id', 'path', 'title', 'createdAt'],
        where : {
          public: true
        },
        include: {
          model: User,
          where: {
            ign: req.params.user
          },
          attributes: ['firstName', 'lastName', 'ign']
        }
      });
      var clips = []
      results.forEach(element => {
        clips.push({
          id: element.id,
          title: element.title,
          date: element.createdAt,
          link: `/clips/GetPublicClip/${element.id}`
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

/*
* Get all of a users public spotlight clips
*/
router.get('/GetSpotlight/:user', jsonParser, async(req, res, nect) => {
  try {
    const results = await Clip.findAll({
      attributes: ['id', 'path', 'title', 'createdAt'],
      where : {
        public: true,
        spotlight: true
      },
      include: {
        model: User,
        where: {
          ign: req.params.user
        },
        attributes: ['firstName', 'lastName', 'ign']
      }
    });
    var clips = []
    results.forEach(element => {
      clips.push({
        id: element.id,
        title: element.title,
        date: element.createdAt,
        link: `/clips/GetPublicClip/${element.id}`
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
        });
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
* Get all of a user's clips
*/
router.get('/GetPrivateClips', jsonParser, requireAuthentication, async(req, res, nect) => {
  try {
    const id = req.user
    const results = await Clip.findAll({ where: { user_id: id } })
    var clips = []
      results.forEach(element => {
        if(element.public){
          clips.push({
            id: element.id,
            title: element.title,
            public: element.public,
            spotlight: element.spotlight,
            date: element.createdAt,
            link: `/clips/GetPublicClip/${element.id}`
          })
        } else {
          clips.push({
            id: element.id,
            title: element.title,
            public: element.public,
            spotlight: element.spotlight,
            date: element.createdAt,
            link: `/clips/GetPrivateClip/${element.id}`
          })
        }
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

/*
* Get a user's private clip
*/
router.get('/GetPrivateClip/:clip', jsonParser, requireAuthentication, async(req, res, nect) => {
  try {
    const clip = await Clip.findByPk(req.params.clip)
    if(clip != null){
      if(clip.user_id = req.user){
        res.sendFile(clip.path)
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
  } catch {
    res.status(500).send({
      error: "Unable to retrieve videos"
    })
  }
})

/*
* Toggle clip spotlight
*/
router.patch('/ToggleSpotlight/:clip', requireAuthentication, async(req, res, next) => {
  try{
    const clip = await Clip.findByPk(req.params.clip)
    if(clip != null){
      if(clip.user_id == req.user){
        await Clip.update(
          { spotlight: !clip.spotlight },
          { where: { id : req.params.clip } }
        )
        res.status(201).send()
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
* Toggle clip privacy
*/
router.patch('/TogglePrivacy/:clip', requireAuthentication, async(req, res, next) => {
  try{
    const clip = await Clip.findByPk(req.params.clip)
    if(clip != null){
      if(clip.user_id == req.user){
        await Clip.update(
          { public: !clip.public },
          { where: { id : req.params.clip } }
        )
        res.status(201).send()
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
* Modify clip title
*/
router.patch('/UpdateTitle/:clip', jsonParser, requireAuthentication, async(req, res, next) => {
  try {
    const clip = await Clip.findByPk(req.params.clip)
    if(clip != null){
      if(clip.user_id = req.user){
        if(req.body.title){
          await Clip.update(
            { title: req.body.title.toString() },
            { where: { id: req.params.clip } }
          )
          res.status(201).send()
        } else {
          res.status(400).send({
            error: "Title required"
          })
        }
      } else {
        res.status(401).send({
          error: "Unauthorized"
        })
      }
    } else {
      res.status(500).send({
        error: "Clip not found"
      })
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

module.exports = router;