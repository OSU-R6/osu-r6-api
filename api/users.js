const router = require('express').Router()
const bcrypt = require('bcrypt')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User, UserSchema } = require('../models/user')
const { Clip } = require('../models/clip')
const { validateAgainstSchema } = require('../lib/validation')
const { requireAuthentication, requireAdmin, generateAuthToken, generateInviteToken, requireInvite } = require('../lib/auth')
const { upload, multerErrorCatch} = require('../lib/multer')


/*
* Register new user
* Registering user requires admin generated invite
*/
router.post('/', jsonParser, requireInvite, async (req, res, next) => {
    try {
      schemaValidation = validateAgainstSchema(req.body, UserSchema)
      if(schemaValidation === null){
        req.body.password = await bcrypt.hash(req.body.password, 8)
        const newUser = await User.create(req.body)
        res.status(201).send({
            newUser
        })
      } else {
        res.status(400).send({
          error: schemaValidation
      })
      }
    } catch (err) {
      // TODO: Find a way to detemine if error 400 or 409 for proper error handling
      if(err.original.sqlMessage){
        res.status(400).send({
          error: err.original.sqlMessage
        })
      } else {
        res.status(400).send({
          error: err
        })
      }
    }
  })


/*
* Login user
*/
router.post('/login', jsonParser, async(req, res, next) => {
  if(req.body.email && req.body.password){
    try {
      const email = req.body.email
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        res.status(400).send({
          error: "Invalid email or password"
        })
      }
      const passwordMatches = await bcrypt.compare(req.body.password, user.password)
      if (!passwordMatches) {
        res.status(400).send({
          error: "Invalid email or password"
        })
      }
      res.status(200).send({
        success: "Logged in as " + user.firstName,
        userId: user.id,
        token: generateAuthToken(user.id)
      })
    } catch (err) {
      res.status(500).send({
        error: "An error occurred while logging in"
      })
    }
  } else {
    res.status(400).send({
      error: "Login requires email and password"
    })
  }
})


/*
* Create user invite token
*/
router.post('/invite', jsonParser, requireAuthentication, requireAdmin, async(req, res, next) => {
  try{
    res.status(200).send({
      success: generateInviteToken()
    })
  } catch (err) {
    res.status(500).send({
      error: "Error generating invite"
    })
  }
})

/*
* Upload user clip
*/
router.post('/upload', jsonParser, requireAuthentication, upload.single('video'), multerErrorCatch, async(req, res, next) => {
  try{ 
    if(!req.file) {
      res.status(400).send({
        error: "MP4 file required"
      })
    } else {
      uploadObject = {
        user: req.user,
        path: req.file.path
      }
      const newUpload = await Clip.create(uploadObject)
      res.status(201).send({
        title: newUpload.title,
        public: newUpload.public,
        date: newUpload.createdAt,
        link: `/clips/${newUpload.id}`
      })
    }
  } catch {
    res.status(500).send({
      error: "Error uploading video"
    })
  }
})


/*
* Get all of a users clips
*/
router.get('/clips', jsonParser, requireAuthentication, async(req, res, nect) => {
  try {
    const id = req.user
    const results = await Clip.findAll({ where: { user: id } })
    var clips = []
      results.forEach(element => {
        clips.push({
          title: element.title,
          public: element.public,
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