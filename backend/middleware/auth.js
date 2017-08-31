
const Response = require('../base/response')

module.exports = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next(null)
    } else {
      Response.sendError(res, Response.FORBIDDEN)
    }
  }
}
