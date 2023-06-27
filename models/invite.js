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
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    used_by_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
  })

  Invite.belongsTo(User, { foreignKey: 'creator_id' });
  Invite.belongsTo(User, { foreignKey: 'used_by_id' });
  Invite.belongsTo(Team, { foreignKey: 'team_id' });

  exports.Invite = Invite