
module.exports = {
  deepAssign (target, ...sources) {
    Array.prototype.slice.call(sources).forEach((source) => {
      target = assign(target, source)
    })

    function assign (target, source) {
      for (let property in source) {
        if (target[property] == null) {
          target[property] = source[property]
        } else {
          if (typeof source[property] === 'object') {
            target[property] = assign(target[property], source[property])
          } else {
            target[property] = source[property]
          }
        }
      }
      return target
    }
    return target
  },

  wrapAsync (fn) {
    if (fn.length <= 3) {
      return function (req, res, next) {
        fn(req, res, next).catch(next)
      }
    } else {
      return function (err, req, res, next) {
        fn(err, req, res, next).catch(next)
      }
    }
  },

  parseError (Response) {
    return (res, error) => {
      if (error.name === 'SequelizeValidationError') {
        Response.sendError(res, Response.CUSTOM_BAD_REQUEST(error.errors.map((error) => error.message)))
      } else {
        Response.sendError(res, Response.SERVER_ERROR)
      }
    }
  }
}
