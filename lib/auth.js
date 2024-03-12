require('dotenv').config();

const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const { Invite } = require('../models/invite')
const { serialize, parse } = require('cookie')

const secretKey = process.env.JWT_SECRET


/* ############################## */
/* ###### Cookie Functions ###### */
/* ############################## */

/*
* Adds cookie information to response header
*/
function setAuthCookie(res, token) {
    res.setHeader("Set-Cookie", serialize("auth", token, {
        path: "/",
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
    }))
}
exports.setAuthCookie = setAuthCookie

/*
* Clears auth cookie from header
*/
function clearAuthCookie(res) {
    res.setHeader("Set-Cookie", serialize("auth", "", {
      path: "/",
      httpOnly: true,
      sameSite: true,
    }))
}
exports.clearAuthCookie = clearAuthCookie


/* ############################## */
/* # Token Generation Functions # */
/* ############################## */

/*
* Generates JWT auth token
*/
function generateAuthToken(userId) {
    const payload = {  type: "auth", user_id: userId }
    const options = { expiresIn: '2h' }
    return jwt.sign(payload, secretKey, options)
}
exports.generateAuthToken = generateAuthToken

/*
* Generates JWT invite token
*/
function generateInviteToken( type, team_id) {
    const payload = { type: type, team_id: team_id }
    const options = { expiresIn: '24h' }
    return jwt.sign(payload, secretKey, options)
}
exports.generateInviteToken = generateInviteToken

/*
* Generates JWT email token
*/
function generateEmailAuthenticationToken(email, firstName) {
    const payload = { type:'emailVerification', email: email, firstName: firstName}
    const options = { expiresIn: '1h' }
    return jwt.sign(payload, secretKey, options)
}
exports.generateEmailAuthenticationToken = generateEmailAuthenticationToken

/*
* Generates JWT pasword reset token
*/
function generatePasswordResetToken(email) {
    const payload = { type:'passwordReset', email: email}
    const options = { expiresIn: '15m' }
    return jwt.sign(payload, secretKey, options)
}
exports.generatePasswordResetToken = generatePasswordResetToken


/* ############################## */
/* # Token Validation Functions # */
/* ############################## */

/*
* Validates JWT email token
*/
function requireEmailAuthenticationToken(req, res, next) {
    try {
        const payload = jwt.verify(req.params.token, secretKey)
        if (payload.type === "emailVerification") {
            req.email = payload.email
            next()
        } else {
            res.status(401).send({
                error: "Invalid Email Verification Token"
            })
        }
    } catch (err) {
        res.status(401).send({
            error: "Invalid Email Verification Token"
        })
    }
}
exports.requireEmailAuthenticationToken = requireEmailAuthenticationToken

/*
* Validates JWT password reset token
*/
function requirePasswordResetToken(req, res, next) {
    try {
        const payload = jwt.verify(req.params.token, secretKey)
        if (payload.type === "passwordReset") {
            req.email = payload.email
            next()
        } else {
            res.status(401).send({
                error: "Invalid Password Reset Token"
            })
        }
    } catch (err) {
        res.status(401).send({
            error: "Invalid Password Reset Token"
        })
    }
}
exports.requirePasswordResetToken = requirePasswordResetToken

/*
* Validate invite token
*/
async function requireInvite(req, res, next){
    try{
        const authHeader = req.get("Authorization") || ''
        const authHeaderParts = authHeader.split(' ')
        const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null
        req.token = token
        const invite = await Invite.findOne({ where: { token: token}})
        if(invite != null && invite.status == "active"){
            const payload = jwt.verify(token, secretKey)
            req.body.type = payload.type
            req.body.team_id = payload.team_id
            next()
        } else {
            res.status(401).send({
                error: "Invite No Longer Active"
            })
        }
    } catch (err) {
        res.status(401).send({
            error: "Invalid invite token"
        })
    }
}
exports.requireInvite = requireInvite;

/*
* Allows access if valid auth token
* This should be applied to all endpoints that require the user to be logged in
*/
function requireAuthentication(req, res, next) {
    const cookies = parse(req.headers.cookie || '')
    const authToken = cookies.auth

    try {
        const payload = jwt.verify(authToken, secretKey)
        req.user = payload.user_id
        next()
    } catch (err) {
        res.status(401).send({
        error: "Invalid authentication token"
        })
    }
}
exports.requireAuthentication = requireAuthentication


function allowAthentication(req, res, next) {
    const cookies = parse(req.headers.cookie || '');
    const authToken = cookies.auth
    try {
        const payload = jwt.verify(authToken, secretKey)
        req.user = payload.user_id
        next()
    } catch (err) {
        req.user = null
        next()
    }
}
exports.allowAthentication = allowAthentication

/*
* Allows access if user is an admin
* This should be applied to all endpoints that only admins can access
* Used after requireAuthentication, req.user must be set
*/
async function requireAdmin(req, res, next) {
    const user = await User.findByPk(req.user)
    if(user.admin)
        next()
    else 
        res.status(403).send({
            error: "Invalid permissions"
        })
}
exports.requireAdmin = requireAdmin
