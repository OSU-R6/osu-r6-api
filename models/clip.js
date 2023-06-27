const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const {User} = require('../models/user')

const Clip = sequelize.define('Clip', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    spotlight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Untitled"
    }
  })

  Clip.belongsTo(User, { foreignKey: 'user_id' });

  exports.Clip = Clip