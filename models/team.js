const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const {User} = require('../models/user')

const Team = sequelize.define('Team', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    captain_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
})

Team.belongsTo(User, { foreignKey: 'coach_id' });
Team.belongsTo(User, { foreignKey: 'captain_id' });

// User table FK defined here to avoid circular dependency
User.belongsTo(Team, { foreignKey: 'team_id' });

exports.Team = Team