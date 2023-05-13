const sequelize = require('../lib/sequelize')
const {DataTypes } = require('sequelize')

/*
* Schema for a User
*/
const UserSchema = {
    firstName:           { required: true, type: 'string' },
    lastName:            { required: true, type: 'string' },
    email:		           { required: true, type: 'string' },
    password:	           { required: true, type: 'string' },
	  admin:		           { required: false, type: 'bool'  },
    status:              { required: false, type: 'string'},
    bio:                 { required: false, type: 'string'}
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
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'inactive'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  })
  exports.User = User