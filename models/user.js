const sequelize = require('../lib/sequelize')
const {DataTypes } = require('sequelize');

/*
* Schema for a User
*/
const UserSchema = {
    name:                { required: true, type: 'string' },
    email:		           { required: true, type: 'string' },
    password:	           { required: true, type: 'string' },
	  admin:		           { required: false, type: 'bool' },
    status:              { required: true, type: 'string' }
};
exports.UserSchema = UserSchema;


const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
      defaultValue: 'active'
    }
  });
  exports.User = User;