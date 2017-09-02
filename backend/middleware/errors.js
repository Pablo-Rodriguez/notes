
module.exports = (Response) => {
  return function (err, req, res, next) {
    console.log('error', err)
    // TODO -> no funciona vete tu a saber por que
    Response.sendError(res, Response.SERVER_ERROR)
  }
}
