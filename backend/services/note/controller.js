
const Controller = require('../../base/controller')

module.exports = (Model, Response) => class extends Controller {
  static async getAll (req, res) {
    try {
      const notes = await Model.getAll(req.user.name)
      Response.sendData(res, {notes})
    } catch (err) {
      Response.sendError(res, Response.SERVER_ERROR)
    }
  }

  static async getNote (req, res) {
    try {
      const note = await Model.getByID(req.user.name, req.params.id)
      if (note) {
        Response.sendData(res, {note})
      } else {
        Response.sendError(res, Response.NOT_FOUND)
      }
    } catch (error) {
      Response.sendError(res, Response.SERVER_ERROR)
    }
  }

  static async createOrUpdate (req, res) {
    try {
      await Model.createOrUpdate(req.user.name, req.body)
      Response.sendOK(res)
    } catch (error) {
      Response.handleValidationErrors(res, error)
    }
  }

  static async delete (req, res) {
    try {
      const deleted = await Model.delete(req.user.name, req.params.id)
      if (deleted > 0) {
        Response.sendOK(res)
      } else {
        Response.sendError(res, Response.NOT_FOUND)
      }
    } catch (err) {
      Response.sendError(res, Response.SERVER_ERROR)
    }
  }
}
