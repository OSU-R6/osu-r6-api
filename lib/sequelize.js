const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('OSU-R6', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = sequelize