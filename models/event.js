const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Event = sequelize.define('Event', {
    type: {
        type: DataTypes.ENUM('10-man', 'tryout','workshop', 'other'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Event Type Required'
          }
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title Required'
          }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date Required'
        }
      }
    }
})

exports.Event = Event