
const Model = require('../../base/model')
const DBSchema = require('./schema')

module.exports = (Schema, {Bcrypt}) => class UserModel extends Model {
  static async getByName (name) {
    return Schema.findOne({where: {name}})
  }

  static async create (body) {
    try {
      return await Schema.create(body)
    } catch (error) {
      DBSchema.validationFailed(error)
      throw error
    }
  }

  static comparePassword (guess, pass) {
    return Bcrypt.compare(guess, pass)
  }
}
