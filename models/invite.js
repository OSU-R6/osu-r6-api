const sequelize = require('../lib/sequelize')
const {DataTypes } = require('sequelize')

const {User} = require('../models/user')

const Invite = sequelize.define('Invite', {
    creator: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    team: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    usedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
  })

  Invite.belongsTo(User, { foreignKey: 'creator' });
  Invite.belongsTo(User, { foreignKey: 'usedBy' });

  exports.Invite = Invite