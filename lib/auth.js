require('dotenv').config();

const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const { Invite } = require('../models/invite')
const { serialize, parse } = require('cookie')

const secretKey = process.env.JWT_SECRET

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
* Adds cookie information to response header
*/
function setAuthCookie(res, token) {
    res.setHeader("Set-Cookie", [
            serialize("auth", token, {
                path: "/",
                httpOnly: true,
                sameSite: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
            })
        ])
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

/*
* Generates JWT invite token
*/
function generateInviteToken(team) {
    const payload = { team: team }
    const options = { expiresIn: '24h' }
    return jwt.sign(payload, secretKey, options)
}
exports.generateInviteToken = generateInviteToken

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
            req.body.team = payload.team
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
    const cookies = parse(req.headers.cookie || '');
    const authToken = cookies.auth;

    try {
        const payload = jwt.verify(authToken, secretKey);
        req.user = payload.user_id;
        next();
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
