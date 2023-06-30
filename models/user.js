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
    ign:                 { required: true, type: 'string' },
    uplay:               { required: true, type: 'string' },
    team_id:             { required: true, type: 'number' },
    bio:                 { required: false, type: 'string'},
    pfp:                 { required: false, type: 'string'},
    role:                { required: true, type: 'string' },
    is_sub:		           { required: true, type: 'boolean'},
    twitch:              { required: false, type: 'string'},
    twitter:             { required: false, type: 'string'},
    instagram:           { required: false, type: 'string'},
    youtube:             { required: false, type: 'string'}
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
  uplay: {
    type: DataTypes.STRING,
    allowNull: true,
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
  },
})

exports.User = User