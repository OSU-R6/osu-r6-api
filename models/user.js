const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

/*
* Schema for a User
*/
const UserSchema = {
    firstName:           { required: true, type: 'string' },
    lastName:            { required: true, type: 'string' },
    email:		           { required: true, type: 'string' },
    password:	           { required: true, type: 'string' },
	  admin:		           { required: false, type: 'boolean'},
    team_id:             { required: true, type: 'number' },
    bio:                 { required: false, type: 'string'},
    pfp:                 { required: false, type: 'string'},
    role:                { required: true, type: 'string' },
    is_sub:		           { required: true, type: 'boolean'},
}
exports.UserSchema = UserSchema

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
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pfp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_sub: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
})

exports.User = User