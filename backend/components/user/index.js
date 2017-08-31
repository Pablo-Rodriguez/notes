
const passport = require('passport')

const Router = require('../../base/router')
const Response = require('../../base/response')
const Schema = require('./schema')
const createModel = require('./model')
const createController = require('./controller')

const Model = createModel(Schema)
const Controller = createController(Model, Response)

module.exports = class extends Router {
  static get mountPoint () {
    return '/user'
  }

  routes () {
    this.router.post('/login', passport.authenticate('local'), Controller.login)
    this.router.post('/signup', Controller.signup)
    this.router.post('/logout', Controller.logout)
  }
}
