
const Model = require('../../base/model')
const Bcrypt = require('../../lib/bcrypt')

module.exports = (Schema) => class UserModel extends Model {
  static async getByName (name) {
    return Schema.findOne({where: {name}})
  }

  static async create (body) {
    return Schema.create(body)
  }

  static comparePassword (guess, pass) {
    return Bcrypt.compare(guess, pass)
  }
}
