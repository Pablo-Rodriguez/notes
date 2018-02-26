
const Controller = require('../../base/controller')
const Messages = require('./messages')

module.exports = (Model, Response, {Passport}) => class extends Controller {
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
      Response.sendOK(res)
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

  static session (req, res) {
    Response.sendData(res, {
      name: req.user.name
    })
  }

  static logout (req, res) {
    req.logout()
    Response.sendOK(res)
  }
}
