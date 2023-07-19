const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Match = sequelize.define('Match', {
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date Required'
        }
      }
    },
    team_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Team ID Required'
          }
        }
    },
    opponent: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Opponent Name Required'
          }
        }
    },
    stream_link: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
  paranoid: true
})

exports.Match = Match