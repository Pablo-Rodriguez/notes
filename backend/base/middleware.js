
module.exports = class {
  use (name, middleware) {
    if (this.config[name] && this.config[name].use === true) {
      console.log(`Using conditional middleware: ${name}`)
      this.router.use(middleware)
    }
  }
}
