const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Team = sequelize.define('Team', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Team Name is Required'
          }
        }
    },
    captain_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    igl_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    active:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

exports.Team = Team