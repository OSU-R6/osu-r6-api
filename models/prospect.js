const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const Prospect = sequelize.define('Prospect', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'First Name is Required'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Last Name is Required'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      notNull: {
        msg: 'Email is required'
      }
    }
  },
  type: {
    type: DataTypes.ENUM('osu_student', 'hs_student'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'User Type is Required'
      }
    }
  },
  rank: {
    type: DataTypes.ENUM('copper', 'bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond', 'champion', 'unranked'),
    allowNull: false,
    validate: {
        notNull: {
          msg: 'Rank is Required'
        }
      }
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('entry', 'support', 'anchor', 'flex', 'igl', 'unknown'),
    allowNull: true
  },
  discord: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notNull: {
          msg: 'Discord is Required'
        }
      }
  },
  uplay: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  competitiveness: {
    type: DataTypes.ENUM('casual', 'mid', 'max'),
    allowNull: false,
  },
  commitment: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start: {
    type: DataTypes.ENUM('immediate', 'next_quarter', 'next_year'),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  }
})

exports.Prospect = Prospect