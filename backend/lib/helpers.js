
module.exports = {
  /**
  * Funcion cuyo comportamiento es similar al de la libreria deep-assign
  * pero que si sobreescribe funciones
  * @param  {Object} target  Objeto al que incorporar/sobreescribir propiedades
  * @param  {Object} sources Objeto que añade/sobreescribe propiedades de target
  * @return {Object}         Objeto con las propiedades de ...sources añadidas
  */
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
  }
}
