
const indicative = require('indicative')

const Model = require('../../base/model')

module.exports = (Schema) => class extends Model {
  static async getByName (name) {
    return Schema.findOne().where('name').equals(name)
  }

  static async getById (id) {
    return Schema.findByID(id)
  }

  static async validate (body) {
    return indicative.validate(body, {
      name: 'required|string|min:1|max:32|regex:[A-Za-z_]+',
      password: 'required|string|min:8|max:256'
    })
  }

  static async create (body) {
    return new Schema(body).save()
  }
}
