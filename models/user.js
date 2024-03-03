const sequelize = require('../lib/sequelize')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
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
  ign: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'IGN is Required'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notNull: {
        msg: 'Email is required'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is Required'
      }
    }
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  type: {
    type: DataTypes.ENUM('active', 'inactive','community', 'alumni'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'User Type is Required'
      }
    }
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      checkTeamId() {
        if (this.type === 'active' && this.team_id == null) {
          throw new Error('Team ID required for active player')
        }
      }
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      checkTeamId() {
        if (this.type === 'active' && this.role == null) {
          throw new Error('Role required for active player')
        }
      }
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pfp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uplay: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  twitch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtube: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isSubstitute: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    validate: {
      checkTeamId() {
        if (this.type === 'active' && this.role == null) {
          throw new Error('Role required for active player')
        }
      }
    }
  }
}, {
  hooks: {
    beforeValidate: (user) => {
      if (user.type !== 'active') {
        user.team_id = null
        user.role = null
      }
    }
  }
})

exports.User = User