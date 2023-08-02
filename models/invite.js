const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

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
    paranoid: true,
    hooks: {
        beforeValidate: (invite) => {
            if (invite.type !== 'active') {
                invite.team_id = null
            }
        }
    }
})

exports.Invite = Invite