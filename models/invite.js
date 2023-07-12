const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const {User} = require('../models/user')
const {Team} = require('../models/team')

const Invite = sequelize.define('Invite', {
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: function () {
            return !this.is_active;
        }
    },
    is_sub: {
        type: DataTypes.BOOLEAN,
        allowNull: function () {
            return !this.is_active;
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    used_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    hooks: {
        beforeValidate: (invite) => {
            if (!invite.is_active) {
                invite.team_id = null; // Set team_id to null when is_active is false
                invite.is_sub = null; // Set is_sub to null when is_active is false
            }
        }
    }
})

Invite.belongsTo(User, { foreignKey: 'creator_id', as: 'Creator' });
Invite.belongsTo(User, { foreignKey: 'used_by_id', as: 'InvitedUser' });
Invite.belongsTo(Team, { foreignKey: 'team_id' });

exports.Invite = Invite