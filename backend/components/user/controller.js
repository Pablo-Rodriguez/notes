
const Controller = require('../../base/controller')

module.exports = (Model, Response) => class extends Controller {
  static async signup (req, res) {
    try {
      await Model.validate(req.body)
      await Model.create(req.body)
      Response.sendOK(res)
    } catch (err) {
      if (Array.isArray(err)) {
        Response.sendError(res, {
          code: 400,
          data: err
        })
      } else {
        throw err
      }
    }
  }

  static login (req, res) {
    if (req.isAuthenticated()) {
      Response.sendOK(res)
    } else {
      Response.sendError(res, Response.BAD_REQUEST)
    }
  }

  static logout (req, res) {
    req.logout()
    Response.sendOK(res)
  }
}
