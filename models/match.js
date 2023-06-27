const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const {Team} = require('../models/team')

const Match = sequelize.define('Match', {
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    team_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    opponent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stream_link: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})

Match.belongsTo(Team, { foreignKey: 'team_id' });

exports.Match = Match