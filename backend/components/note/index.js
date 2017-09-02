
const Router = require('../../base/router')
const Response = require('../../base/response')
const Schema = require('./schema')
const createModel = require('./model')
const createController = require('./controller')
const requiresAuth = require('../../middleware/auth')

const Model = createModel(Schema)
const Controller = createController(Model, Response)

module.exports = class extends Router {
  static get mountPoint () {
    return '/note'
  }

  routes () {
    this.router.get('/', requiresAuth, Router.wrap(Controller.get))
    this.router.get('/:id', requiresAuth, Router.wrap(Controller.getNote))
    this.router.put('/', requiresAuth, Router.wrap(Controller.createOrUpdate))
    this.router.delete('/:id', requiresAuth, Router.wrap(Controller.delete))
  }
}
