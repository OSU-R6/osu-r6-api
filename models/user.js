const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ign: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  classification: {
    type: DataTypes.ENUM('active', 'inactive','community', 'alumni'),
    allowNull: false
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: function () {
      return this.classification !== 'active';
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: function () {
      return this.classification !== 'active';
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pfp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uplay: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  twitch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtube: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  hooks: {
    beforeValidate: (user) => {
      if (user.classification !== 'active') {
        user.team_id = null; // Set team_id to null when is_active is false
        user.role = null; // Set role to null when is_active is false
      }
    }
  }
})

exports.User = User