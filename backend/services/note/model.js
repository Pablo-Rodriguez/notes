
const Model = require('../../base/model')

module.exports = (Schema) => class extends Model {
  static getAll (username) {
    return Schema.findAll({where: {fk_user: username}})
  }

  static getByID (username, id) {
    return Schema.findOne({where: {fk_user: username, id}})
  }

  static createOrUpdate (username, body) {
    body.fk_user = username
    return Schema.create(body)
  }

  static delete (username, id) {
    return Schema.destroy({where: {fk_user: username, id}})
  }
}
