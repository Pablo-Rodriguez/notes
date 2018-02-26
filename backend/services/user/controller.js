
const Controller = require('../../base/controller')
const Messages = require('./messages')

module.exports = (Model, Response, {Passport}) => class UserController extends Controller {
  static async signup (req, res) {
    try {
      await Model.create(req.body)
      Response.sendOK(res)
    } catch (error) {
      Response.handleValidationErrors(res, error)
    }
  }

  static async login (req, res, next) {
    try {
      const user = await Passport.authenticate(req, res, next, 'local')
      await Passport.login(req, user)
      Response.sendData(res, UserController.sessionInfo(user))
    } catch (error) {
      if (error === 'Missing credentials' || error === 'WrongAccount') {
        Response.sendError(res, Response.CUSTOM_BAD_REQUEST({
          message: Messages.LOGIN_FAILURE
        }))
      } else {
        Response.sendError(res, Response.SERVER_ERROR)
      }
    }
  }

  static sessionInfo (user) {
    return {
      name: user.name
    }
  }

  static session (req, res) {
    Response.sendData(res, UserController.sessionInfo(req.user))
  }

  static logout (req, res) {
    if (req.isAuthenticated()) {
      req.logout()
    }
    Response.sendOK(res)
  }
}
