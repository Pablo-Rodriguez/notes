
const Response = require('../base/response')

module.exports = () => {
  return (err, req, res) => {
    console.error(err)
    Response.sendError(res, Response.SERVER_ERROR)
  }
}
