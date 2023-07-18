const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const {User} = require('../models/user')

const Clip = sequelize.define('Clip', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'Public must be a boolean'
        }
      }
    },
    spotlight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'Spotlight must be a boolean'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Untitled",
      validate: {
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Title must be a string');
          }
        }
      }
    }
  })

  Clip.belongsTo(User, { foreignKey: 'user_id' });

  exports.Clip = Clip