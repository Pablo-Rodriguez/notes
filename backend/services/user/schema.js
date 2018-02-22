
const Schema = require('../../base/schema')
const Bcrypt = require('../../lib/bcrypt')

module.exports = class UserSchema extends Schema {
  static get NAME () { return 'user' }

  static properties (Sequelize) {
    return {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          len: [1, 16],
          isAlphanumeric: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [8, 128]
        }
      }
    }
  }

  static options () {
    return {
      hooks: {
        beforeCreate: UserSchema.beforeCreate
      }
    }
  }

  static async beforeCreate (user) {
    const hash = await Bcrypt.hash(user.password)
    user.password = hash
  }
}
