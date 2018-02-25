
const Controller = require('../../base/controller')

module.exports = (Model, Response, {Passport}) => class extends Controller {
  static async signup (req, res) {
    try {
      await Model.create(req.body)
      Response.sendOK(res)
    } catch (error) {
      console.log(error)
      Response.handleValidationErrors(res, error)
    }
  }

  static async login (req, res, next) {
    try {
      const user = await Passport.authenticate(req, res, next, 'local')
      await Passport.login(req, user)
      Response.sendOK(res)
    } catch (error) {
      if (error === 'Missing credentials' || error === 'WrongAccount') {
        Response.sendError(res, Response.CUSTOM_BAD_REQUEST({
          message: 'Wrong username and/or password'
        }))
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
