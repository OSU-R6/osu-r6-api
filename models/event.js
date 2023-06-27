const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Event = sequelize.define('Event', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
})

exports.Event = Event