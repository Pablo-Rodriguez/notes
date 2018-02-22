
const Controller = require('../../base/controller')

module.exports = (Model, Response, {Passport, parseError}) => class extends Controller {
  static async signup (req, res) {
    try {
      await Model.create(req.body)
      Response.sendOK(res)
    } catch (error) {
      parseError(res, error)
    }
  }

  static async login (req, res, next) {
    try {
      const user = await Passport.authenticate(req, res, next, 'local')
      await Passport.login(req, user)
      Response.sendOK(res)
    } catch (error) {
      if (error === 'Missing credentials' || error === 'WrongAccount') {
        Response.sendError(res, Response.BAD_REQUEST)
      } else {
        Response.sendError(res, Response.SERVER_ERROR)
      }
    }
  }

  static logout (req, res) {
    req.logout()
    Response.sendOK(res)
  }
}
