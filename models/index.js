const {User} = require('./user')
const {Team} = require('./team')
const {Match} = require('./match')
const {Event} = require('./event')
const {Invite} = require('./invite')
const {Clip} = require('./clip')

User.belongsTo(Team, { foreignKey: 'team_id' })
Team.hasMany(User, { foreignKey: 'team_id' })

Team.belongsTo(User, { foreignKey: 'coach_id' })
User.hasMany(Team, { foreignKey: 'coach_id' })
Team.belongsTo(User, { foreignKey: 'captain_id' })
User.hasOne(Team, { foreignKey: 'captain_id' })
Team.belongsTo(User, { foreignKey: 'igl_id' })
User.hasOne(Team, { foreignKey: 'igl_id' })

Clip.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Clip, { foreignKey: 'user_id' })

Invite.belongsTo(User, { foreignKey: 'inviter_id', as: 'Inviter' })
User.hasMany(Invite, { foreignKey: 'inviter_id', as: 'Inviter' })
Invite.belongsTo(User, { foreignKey: 'invitee_id', as: 'Invitee' })
User.hasOne(Invite, { foreignKey: 'invitee_id', as: 'Invitee' })
Invite.belongsTo(Team, { foreignKey: 'team_id' })
Team.hasMany(Invite, { foreignKey: 'team_id' })

Match.belongsTo(Team, { foreignKey: 'team_id' })
Team.hasMany(Match, { foreignKey: 'team_id' })

module.exports = {
    User,
    Team,
    Match,
    Event,
    Invite,
    Clip
}