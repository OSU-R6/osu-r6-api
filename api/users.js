const router = require('express').Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const sequelize = require('../lib/sequelize')
const { Op } = require('sequelize')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User, Clip, Invite, Team } = require('../models/index')
const { requireAuthentication, requireAdmin, generateAuthToken, requireInvite, setAuthCookie, clearAuthCookie, allowAthentication } = require('../lib/auth')
const { imageUpload, multerErrorCatch} = require('../lib/multer')


/* #####################################################################
/*                        Public User Endpoints
/* ##################################################################### */

/*
* Get User's Public Profile
*/
router.get('/:user', async(req, res, next) => {
  try {
    const user = await User.findOne({
      where: {ign: req.params.user},
      attributes: {
        exclude: ['admin', 'password', 'email', 'pfp', 'createdAt', 'updatedAt']
      }
    })
    user.pfp = '/users/GetProfileImage/' + user.ign
    if(user != null){
      res.status(200).send(user)
    } else {
      res.status(500).send({
        error: "User Not Found"
      })
    }
  } catch {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

/*
* Get User Profile Image 
*/
router.get('/:user/pfp', async(req, res, next) => {
  try {
    const user = await User.findOne({where: {ign: req.params.user}})
    if(user.pfp != null) {
      const filePath = path.join(__dirname, '/uploads/profile-images/', user.pfp);
      res.sendFile(filePath)
    } else {
      res.status(404).send({
        error: "No Profile Image Found"
      })
    }
  } catch {
    res.status(500).send({
      error: "Error retrieving file"
    })
  }
})


/*
* Get User's Clips
*/
router.get('/:user/clips', jsonParser, allowAthentication, async(req, res, nect) => {
  try {
    const results = await Clip.findAll({
      attributes: ['id', 'public', 'spotlight', 'path', 'title', 'createdAt'],
      where : {
        [Op.or]: [
          { public: true },
          { user_id: req.user }
        ]
      },
      include: {
        model: User,
        where: {
          ign: req.params.user
        },
        attributes: ['firstName', 'lastName', 'ign']
      }
    })
    var clips = []
    results.forEach(element => {
      clips.push({
        id: element.id,
        title: element.title,
        public: element.public,
        spotlight: element.spotlight,
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

/*
* Get User's Spotlight Clips
*/
router.get('/:user/spotlight', jsonParser, async(req, res, nect) => {
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
/*              Login/Registration/Authentication Endpoints
/* ##################################################################### */

/*
* Register New User
* Registering user requires admin generated invite
*/
router.post('/', jsonParser, requireInvite, async (req, res, next) => {
  try {
    const userToCreate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      ign: req.body.ign,
      email: req.body.email,
      type: req.body.type,
      team_id: req.body.team_id,
      role: req.body.role
    }
    if(req.body.password != null) {
      // TODO: Validate password vs regex
      userToCreate.password = await bcrypt.hash(req.body.password, 8)
    }
    const newUser = User.build(userToCreate)
    try {
      await newUser.validate()
      await newUser.save()
      if( await Invite.update(
        { usedBy: newUser.id, status: "inactive"},
        { where: {token: req.token} }
      ) == null) {
        res.status(500).send({
          error: "Error Deactiviating Invite"
        })
      } else {
        res.status(201).send()
      }
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

/*
* Check Email Availibility
*/
router.get('/email-availibility/:email', jsonParser, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: {email: req.params.email}})
    if(user === null){
      res.status(200).send()
    } else {
      res.status(401).send({
        error: "Email Not Available"
      })
    }
  } catch (err) {
      res.status(400).send({
        error: err
      })
  }
})

/*
* Check IGN Availibility
*/
router.get('/ign-availibility/:ign', jsonParser, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: {ign: req.params.ign}})
    if(user === null){
      res.status(200).send()
    } else {
      res.status(401).send({
        error: "IGN Not Available"
      })
    }
  } catch (err) {
      res.status(400).send({
        error: err
      })
  }
})

/*
* Login User
*/
router.post('/login', jsonParser, async(req, res, next) => {
  if(req.body.email && req.body.password){
    try {
      const email = req.body.email
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        res.status(401).send({
          error: "Invalid email or password"
        })
      } else {
        const passwordMatches = await bcrypt.compare(req.body.password, user.password)
        if (!passwordMatches) {
          res.status(401).send({
            error: "Invalid email or password"
          })
        } else {
          setAuthCookie(res, generateAuthToken(user.id))
          res.status(200).send()
        }
      }
    } catch (err) {
      res.status(500).send({
        error: "An error occurred while logging in"
      })
    }
  } else {
    res.status(401).send({
      error: "Login requires email and password"
    })
  }
})


/* #####################################################################
/*                        Private User Endpoints
/* ##################################################################### */

/*
* Login Check
*/
router.get('/authenticate', requireAuthentication, async(req, res, next) => {
  const user = await User.findByPk(req.user, {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  })
  res.status(200).send(user)
})

/*
* Logout User
*/
router.post('/logout', async(req, res, next) => {
  clearAuthCookie(res)
  res.status(200).end()
})

/*
* Edit User
*/
router.patch('/', requireAuthentication, jsonParser, async(req, res, next) => {
  try{
    const user = await User.findByPk(req.user)
    const updatedFields = ['bio', 'uplay', 'twitch', 'twitter', 'youtube', 'instagram']

    updatedFields.forEach(field => {
      user[field] = req.body[field] || user[field]
    })

    try {
      await user.validate()
      await user.save()
      res.status(200).send()
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
* Upload User Profile Image
*/
router.post('/pfp', jsonParser, requireAuthentication, imageUpload.single('image'), multerErrorCatch, async(req, res, next) => {
  try{ 
    if(!req.file) {
      res.status(400).send({
        error: "PNG or JPG File Required"
      })
    } else {
      var user = await User.findByPk(req.user)
      if(user.pfp != null){
        const filePath = path.join(__dirname, '/uploads/profile-images/', user.pfp);
        fs.unlink(filePath, async(err) => {
          if (err) {
            res.status(404).send({
              error: "Error removing existing profile image"
            })
          } else {
            user = await User.update(
              {pfp: req.file.filename},
              {where: {id: req.user}}
            )
            res.status(201).send()
          }
        });
      } else {
        user = await User.update(
          {pfp: req.file.filename},
          {where: {id: req.user}}
        )
        res.status(201).send()
      }
    }
  } catch {
    res.status(500).send({
      error: "Error Uploading Image"
    })
  }
})

/*
* Get List of Users
*/
router.get('/', requireAuthentication, requireAdmin, async(req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'email', 'pfp', 'createdAt', 'updatedAt'],
        include: [
          [
            sequelize.literal('Team.name'),
            'team_id'
          ]
        ]
      },
      include: [
        {
          model: Team,
          attributes: []
        }
      ]
    })
    if(users.length > 0) {
      res.status(200).send(users)
    } else {
      res.status(404).send({
        error: "No Users Found"
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: "Server Error"
    })
  }
})

/*
* Delete User
*/
router.delete('/:id', requireAuthentication, requireAdmin, async(req, res, next) => {
  try{
      User.destroy({where: {id: req.params.id}})
      res.status(204).send()
  } catch (err) {
      res.status(500).send({
          error: "Server Error"
      })
  }
})


module.exports = router;