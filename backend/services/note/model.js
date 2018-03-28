
const Model = require('../../base/model')

module.exports = (Schema) => class NoteModel extends Model {
  static getAll (username) {
    return Schema.findAll({where: {fk_user: username}})
  }

  static getByID (username, id) {
    return Schema.findOne({where: {fk_user: username, id}})
  }

  static async createOrUpdate (username, body) {
    body.fk_user = username
    if (body.new === true && body.id != null) {
      delete body.id
      return Schema.create(body)
    } else {
      await Schema.upsert(body)
      return NoteModel.getByID(username, body.id)
    }
  }

  static remove (username, id) {
    return Schema.destroy({where: {fk_user: username, id}})
  }
}
