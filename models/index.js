const {User} = require('./user')
const {Team} = require('./team')
const {Match} = require('./match')
const {Event} = require('./event')
const {Invite} = require('./invite')
const {Clip} = require('./clip')
const {Prospect} = require('./prospect')

User.belongsTo(Team, { foreignKey: 'team_id', as: 'team' })
Team.hasMany(User, { foreignKey: 'team_id', as: 'teamMembers' })

Team.belongsTo(User, { foreignKey: 'coach_id', as: 'coach' })
User.hasMany(Team, { foreignKey: 'coach_id', as: 'coachedTeams' })
Team.belongsTo(User, { foreignKey: 'captain_id', as: 'captain' })
User.hasOne(Team, { foreignKey: 'captain_id', as: 'captainedTeam' })
Team.belongsTo(User, { foreignKey: 'igl_id', as: 'igl' })
User.hasOne(Team, { foreignKey: 'igl_id', as: 'ledTeam' })

Clip.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Clip, { foreignKey: 'user_id' })

Invite.belongsTo(User, { foreignKey: 'inviter_id', as: 'inviter' })
User.hasMany(Invite, { foreignKey: 'inviter_id', as: 'createdInvites' })
Invite.belongsTo(User, { foreignKey: 'invitee_id', as: 'invitee' })
User.hasOne(Invite, { foreignKey: 'invitee_id', as: 'recievedInvite' })
Invite.belongsTo(Team, { foreignKey: 'team_id', as: 'team' })
Team.hasMany(Invite, { foreignKey: 'team_id', as: 'teamInvites' })

Match.belongsTo(Team, { foreignKey: 'team_id' })
Team.hasMany(Match, { foreignKey: 'team_id' })

module.exports = {
    User,
    Team,
    Match,
    Event,
    Invite,
    Clip,
    Prospect
}