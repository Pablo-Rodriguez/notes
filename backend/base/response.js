
const messages = require('./messages')

module.exports = class Response {
  static sendData (res, data = {}) {
    res.json({
      error: false,
      data
    })
  }

  static sendOK (res) {
    Response.sendData(res)
  }

  static sendError (res, error) {
    console.log(res.status)
    res.status(500).end()
    // res.status(error.code).json({
    //   error: true,
    //   data: error.data
    // })
  }

  static get NOT_FOUND () {
    return {
      code: 404,
      data: messages.NOT_FOUND
    }
  }

  static get SERVER_ERROR () {
    return {
      code: 500,
      data: messages.SERVER_ERROR
    }
  }

  static get FORBIDDEN () {
    return {
      code: 403,
      data: messages.FORBIDDEN
    }
  }

  static get BAD_REQUEST () {
    return {
      code: 400,
      data: messages.BAD_REQUEST
    }
  }
}
