const {User} = require('./user')
const {Team} = require('./team')
const {Match} = require('./match')
const {Event} = require('./event')
const {Invite} = require('./invite')
const {Clip} = require('./clip')
const {Prospect} = require('./prospect')
const {Attendee} = require('./attendee')
const {Announcement} = require('./announcement')

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

Event.hasMany(Attendee, { foreignKey: 'event_id' })
Attendee.belongsTo(Event, { foreignKey: 'event_id' })
User.hasMany(Attendee, { foreignKey: 'user_id' })
Attendee.belongsTo(User, { foreignKey: 'user_id' })

Announcement.belongsTo(User, { foreignKey: 'author_id' })
User.hasMany(Announcement, { foreignKey: 'author_id' })
Announcement.belongsTo(Team, { foreignKey: 'team_id' })
Team.hasMany(Announcement, { foreignKey: 'team_id' })


module.exports = {
    User,
    Team,
    Match,
    Event,
    Invite,
    Clip,
    Prospect,
    Attendee,
    Announcement
}