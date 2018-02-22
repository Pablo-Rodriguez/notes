
module.exports = class Schema {
  static define (Sequelize, db) {
    console.log(`Database: Defining model ${this.NAME}`)
    return db.define(this.NAME, this.properties(Sequelize, db), this.options(Sequelize, db))
  }

  static get (db) {
    return db.model(this.NAME)
  }

  static properties () { return {} }
  static options () { return {} }
  static afterDefine () {}
}
