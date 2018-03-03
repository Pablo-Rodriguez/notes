
const Schema = require('../../base/schema')
const Validation = require('../../lib/validation')
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
          len: Validation.len(1, 16),
          isAlphanumeric: Validation.alphanumeric()
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: Validation.len(8, 128)
        }
      }
    }
  }

  static options () {
    return {
      hooks: {
        beforeCreate: UserSchema.beforeCreate,
        validationFailed: (instance, options, error) => UserSchema.validationFailed(error)
      }
    }
  }

  static async beforeCreate (user) {
    const hash = await Bcrypt.hash(user.password)
    user.password = hash
  }

  static get PRIMARY_KEY_ERROR () {
    return 'That username is already in use'
  }

  static validationFailed (error) {
    if (error.alreadyHandled !== true) {
      if (error.name && error.name.startsWith('Sequelize')
        && error.errors != null) {
        error.type = 'Validation error'
      }
      error.errors = error.errors && error.errors.map((error) => {
        if (error.path.toLowerCase() === 'primary') {
          return {
            field: 'name',
            message: UserSchema.PRIMARY_KEY_ERROR
          }
        } else {
          return {
            field: error.path,
            message: error.message
          }
        }
      })
      error.alreadyHandled = true
    }
  }
}
