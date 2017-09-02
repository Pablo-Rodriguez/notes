
const Controller = require('../../base/controller')

module.exports = (Model, Response) => class extends Controller {
  static async get (req, res) {
    const notes = await Model.findAll(req.user._id)
    Response.sendData(res, {notes})
  }

  static async getNote (req, res) {
    const note = await Model.findByID(req.user._id, req.params.id)
    Response.sendData(res, {note})
  }

  static async createOrUpdate (req, res) {
    try {
      await Model.validate(req.body)
      await Model.create(req.user._id, req.body)
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

  static async delete (req, res) {
    try {
      await Model.delete(req.user._id, req.params.id)
    } catch (err) {
      if (err.name === 'Unknown Note') {
        Response.sendError(res, Response.BAD_REQUEST)
      } else {
        throw err
      }
    }
  }
}
