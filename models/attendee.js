const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Attendee = sequelize.define('Attendee', {
    event_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    paranoid: true,
    uniqueKeys: {
        event_user_unique: {
            fields: ['event_id', 'user_id', 'deletedAt']
        }
    }
})

exports.Attendee = Attendee