
const DBSchema = require('./schema')
const createModel = require('./model')
const createController = require('./controller')
const Router = require('../../base/router')
const Passport = require('../../lib/passport')
const Response = require('../../base/response')

module.exports = class extends Router {
  static get mountPoint () {
    return '/api'
  }

  configure () {
    const Schema = DBSchema.get(this.config.db)
    const Model = createModel(Schema)
    this.Controller = createController(Model, Response, {Passport})
  }

  routes () {
    this.post('/login', Router.wrap(this.Controller.login))
    this.post('/signup', Router.wrap(this.Controller.signup))
    this.post('/logout', this.Controller.logout)
  }
}
