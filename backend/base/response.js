
const messages = require('./messages')

module.exports = createResponse()

function createResponse () {
  class Response {
    static sendData (res, data = {}) {
      res.json({
        error: false,
        code: 200,
        data
      })
    }

    static sendOK (res) {
      Response.sendData(res)
    }

    static sendError (res, error) {
      res.status(error.code).json({
        error: true,
        code: error.code,
        data: error.data
      })
    }

    static handleValidationErrors (res, error) {
      if (error.type === 'Validation error') {
        this.sendError(res, Response.CUSTOM_BAD_REQUEST({
          fields: error.errors
        }))
      } else {
        this.sendError(res, Response.SERVER_ERROR)
      }
    }

    static CUSTOM_BAD_REQUEST (data) {
      return {
        code: 400,
        data
      }
    }
  }

  Object.assign(Response, {
    NOT_FOUND: {
      code: 404,
      data: {
        message: messages.NOT_FOUND
      }
    },
    SERVER_ERROR: {
      code: 500,
      data: {
        message: messages.SERVER_ERROR
      }
    },
    FORBIDDEN: {
      code: 403,
      data: {
        message: messages.FORBIDDEN
      }
    },
    BAD_REQUEST: Response.CUSTOM_BAD_REQUEST({
      message: messages.BAD_REQUEST
    })
  })

  return Response
}
