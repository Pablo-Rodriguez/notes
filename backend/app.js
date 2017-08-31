
const mix = require('mixin-es6')

const Router = require('./base/router')
const Middleware = require('./middleware')
const Passport = require('./lib/passport/')
const UserRouter = require('./components/user/')

module.exports = class extends mix(Router, Middleware) {
  configure () {
    Passport.configure()
  }

  routes () {
    this.mount(UserRouter)
  }
}
