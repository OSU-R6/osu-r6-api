const router = require('express').Router()

const bcrypt = require('bcrypt')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json() 

const { User, UserSchema } = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');
const { requireAuthentication, requireAdmin, generateAuthToken, generateInviteToken, requireInvite } = require('../lib/auth');


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
      const user = await User.findOne({ where: { email } })
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
        success: "Logged in as " + user.name,
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
      success: generateInviteToken(req.user)
    })
  } catch (err) {
    res.status(500).send({
      error: "Error generating invite"
    })
  }
})


module.exports = router;