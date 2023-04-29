const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

// REMOVE FOR PRODUCTION
const secretKey = "SuperSecretKey"

/*
* Generates JWT auth token
*/
function generateAuthToken(userId) {
    const payload = {  type: "auth", user_id: userId }
    const options = { expiresIn: '1h' }
    return jwt.sign(payload, secretKey, options)
}
exports.generateAuthToken = generateAuthToken

/*
* Generates JWT invite token
*/
function generateInviteToken() {
    const payload = { type: "invite" }
    const options = { expiresIn: '24h' }
    return jwt.sign(payload, secretKey, options)
}
exports.generateInviteToken = generateInviteToken

/*
* Validate invite token
*/
function requireInvite(req, res, next){
    const authHeader = req.get("Authorization") || ''
    const authHeaderParts = authHeader.split(' ')
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null
    try{
        const payload = jwt.verify(token, secretKey)
        next()
    } catch (err) {
        res.status(401).send({
            error: "Invalid invite token."
        })
    }
}
exports.requireInvite = requireInvite;

/*
* Allows access if valid auth token
* This should be applied to all endpoints that require the user to be logged in
*/
function requireAuthentication(req, res, next) {
    const authHeader = req.get("Authorization") || ''
    const authHeaderParts = authHeader.split(' ')
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null
    try {
        const payload = jwt.verify(token, secretKey)
        req.user = payload.user_id
        next()
    } catch (err) {
        res.status(401).send({
            error: "Invalid authentication token"
        });
    }
}
exports.requireAuthentication = requireAuthentication

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
        res.status(401).send({
            error: "Invalid permissions"
        });
}
exports.requireAdmin = requireAdmin
