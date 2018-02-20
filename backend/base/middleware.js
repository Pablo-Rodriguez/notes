
const middleware = {}

module.exports = class Middlewares {
  use (name, middleware) {
    if (this.config[name] && this.config[name].use === true) {
      console.log(`Using conditional middleware: ${name}`)
      this.router.use(middleware)
    }
  }

  static register (name, fn) {
    middleware[name] = fn
  }

  static get (name) {
    return middleware[name]
  }
}
