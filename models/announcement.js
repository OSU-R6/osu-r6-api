const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Announcement = sequelize.define('Announcement', {
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    paranoid: true
})

exports.Announcement = Announcement