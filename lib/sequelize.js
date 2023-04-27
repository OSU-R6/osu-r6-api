const { Sequelize } = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DB_NAME || 'OSU-R6',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password'
})

module.exports = sequelize