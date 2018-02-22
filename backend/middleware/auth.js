
module.exports = (Response) => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next(null)
    } else {
      Response.sendError(res, Response.FORBIDDEN)
    }
  }
}
