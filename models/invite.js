const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const {User} = require('../models/user')
const {Team} = require('../models/team')

const Invite = sequelize.define('Invite', {
    inviter_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },
    type: {
        type: DataTypes.ENUM('active', 'inactive','community', 'alumni'),
        allowNull: false,
        validate: {
            notNull: {
              msg: 'User Type Required'
            }
        }
      },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            checkTeamId() {
              if (this.type === 'active' && this.team_id == null) {
                throw new Error('Team ID required for active invite')
              }
            }
          }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    invitee_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    hooks: {
        beforeValidate: (invite) => {
            if (invite.type !== 'active') {
                invite.team_id = null
            }
        }
    }
})

Invite.belongsTo(User, { foreignKey: 'inviter_id', as: 'Inviter' })
Invite.belongsTo(User, { foreignKey: 'invitee_id', as: 'Invitee' })
Invite.belongsTo(Team, { foreignKey: 'team_id' })

exports.Invite = Invite