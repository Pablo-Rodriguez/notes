
const Model = require('../../base/model')

module.exports = (Schema) => class extends Model {
  static findAll (username) {
    return Schema.find().where('user').equals(username)
  }

  static findByID (id) {
    return Schema.findOneByID(id)
  }

  static validate (body) {
    // TODO -> validate
  }

  static async createOrUpdate (body) {
    // TODO -> create or update
  }
}
