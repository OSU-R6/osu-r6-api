const router = require('express').Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const sequelize = require('../lib/sequelize')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User } = require('../models/user')
const { Invite } = require('../models/invite')
const { Team } = require('../models/team')
const { requireAuthentication, requireAdmin, generateAuthToken, generateInviteToken, requireInvite, setAuthCookie, clearAuthCookie } = require('../lib/auth')
const { imageUpload, multerErrorCatch} = require('../lib/multer')


/* #####################################################################
/*                        Public User Endpoints
/* ##################################################################### */

/*
* Get user's public profile
*/
router.get('/GetPublicProfile/:user', async(req, res, next) => {
  try {
    const user = await User.findOne({
      where: {ign: req.params.user},
      attributes: {
        exclude: ['password', 'email', 'pfp', 'createdAt', 'updatedAt']
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
* Get a profile image for a player
*/
router.get('/GetProfileImage/:user', async(req, res, next) => {
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
* Register new user
* Registering user requires admin generated invite
*/
router.post('/', jsonParser, requireInvite, async (req, res, next) => {
  try {
    const userToCreate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      ign: req.body.ign,
      email: req.body.email,
      role: req.body.role,
      is_active: req.body.is_active,
      team_id: req.body.team_id,
      is_sub: req.body.is_sub
    }
    userToCreate.password = await bcrypt.hash(req.body.password, 8)
    const newUser = await User.create(userToCreate)
    if( newUser != null) {
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
    } else {
      res.status(500).send({
        error: "Error Creating User"
      })
    }
  } catch (err) {
    // TODO: Find a way to detemine if error 400 or 409 for proper error handling
      res.status(400).send({
        error: err
      })
   // }
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
* Login user
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
* Logout user
*/
router.post('/logout', async(req, res, next) => {
  clearAuthCookie(res)
  res.status(200).end()
})

/*
* Update bio
*/
router.patch('/UpdateBio', requireAuthentication, jsonParser, async(req, res, next) => {
  try {
    if(req.body.bio){
      const user = await User.update(
        { bio: req.body.bio },
        { where: { id : req.user } }
      )
      res.status(201).send(user)
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})

/*
* Upload user profile image
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
            'team'
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


module.exports = router;