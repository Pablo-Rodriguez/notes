
const Sequelize = require('sequelize')

const UserSchema = require('../services/user/schema')
const NoteSchema = require('../services/note/schema')

module.exports = class {
  static async connect ({url = '', options = {}, sync = {}} = {}) {
    console.log(`Database: trying to connect to ${url}`)
    Sequelize.Promise = global.Promise
    const db = new Sequelize(url, options)

    const User = UserSchema.define(Sequelize, db)
    const Note = NoteSchema.define(Sequelize, db)
    User.hasMany(Note, {
      as: 'notes'
    })
    Note.belongsTo(User, {
      foreignKey: 'fk_user',
      targetKey: 'name'
    })
    
    await db.sync(sync)
    return db
  }
}
