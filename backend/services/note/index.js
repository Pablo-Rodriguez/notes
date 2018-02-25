
const Router = require('../../base/router')
const Response = require('../../base/response')
const DBSchema = require('./schema')
const createModel = require('./model')
const createController = require('./controller')

module.exports = class extends Router {
  static get mountPoint () {
    return '/api/note'
  }

  configure () {
    const Schema = DBSchema.get(this.config.db)
    const Model = createModel(Schema)
    this.Controller = createController(Model, Response)
  }

  routes () {
    this.get('/', 'auth', Router.wrap(this.Controller.getAll))
    this.get('/:id', 'auth', Router.wrap(this.Controller.getNote))
    this.put('/', 'auth', Router.wrap(this.Controller.createOrUpdate))
    this.delete('/:id', 'auth', Router.wrap(this.Controller.delete))
  }
}
