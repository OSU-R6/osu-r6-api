const router = require('express').Router()
const bcrypt = require('bcrypt')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User, UserSchema } = require('../models/user')
const { validateAgainstSchema } = require('../lib/validation')
const { requireAuthentication, requireAdmin, generateAuthToken, generateInviteToken, requireInvite, setAuthCookie, clearAuthCookie } = require('../lib/auth')


/* #####################################################################
/*                        Public User Endpoints
/* ##################################################################### */


/*
* Get user's public profile
*/
router.get('/GetPublicProfile/:user', async(req, res, next) => {
  try {
    const user = await User.findOne({where: {ign: req.params.user} })
    if(user != null){
      res.status(200).send({
        firstName: user.firstName,
        lastName: user.lastName,
        ign: user.ign,
        bio: user.bio
      })
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
* Get all alumni
*/
router.get('/alumni', jsonParser, async(req, res, next) => {
  try{
    const alumni = await User.findAll({ 
      where: {status : "inactive"},
      attributes: ['firstName', 'lastName', 'ign']
    })
    if(alumni.length > 0){
      res.status(260).send(
        alumni
      )
    } else {
      res.status(404).send({
        error: "No Alumni Found"
      })
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})


/*
* Get all active members
*/
router.get('/active', jsonParser, async(req, res, next) => {
  try{
    const alumni = await User.findAll({ 
      where: {status : "active"},
      attributes: ['firstName', 'lastName', 'ign']
    })
    if(alumni.length > 0){
      res.status(260).send(
        alumni
      )
    } else {
      res.status(404).send({
        error: "No Active Members Found"
      })
    }
  } catch (err) {
    res.status(500).send({
      error: "Server Error"
    })
  }
})


/*
* Register new user
* Registering user requires admin generated invite
*/
router.post('/', jsonParser, requireInvite, async (req, res, next) => {
  try {
    const schemaValidation = validateAgainstSchema(req.body, UserSchema)
    if(schemaValidation === null){
      req.body.admin = false
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
  const user = await User.findByPk(req.user)
  res.status(200).send({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    ign: user.ign,
    bio: user.bio
  })
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


/* #####################################################################
/*                        Admin User Endpoints
/* ##################################################################### */


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


module.exports = router;