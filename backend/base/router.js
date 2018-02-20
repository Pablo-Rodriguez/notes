
const {Router} = require('express')

const Middleware = require('./middleware')
const {wrapAsync} = require('../lib/helpers')

module.exports = class {
  constructor ({router = Router(), config = {}} = {}) {
    this.router = router
    this.config = config
    this.configure()
    this.firstmiddleware()
    this.premiddleware()
    this.routes()
    this.postmiddleware()
    this.lastmiddleware()
  }

  static get mountPoint () {
    return ''
  }

  getRouter () {
    return this.router
  }

  static wrap (fn) {
    return wrapAsync(fn)
  }

  configure () {}

  firstmiddleware () {}

  premiddleware () {}

  registerMiddleware (name, fn) {
    Middleware.register(name, fn)
  }

  routes () {}

  route (method, path, ...args) {
    const middleware = []
    args = args.map((middle) => {
      if (typeof middle === 'string') {
        middleware.push(middle)
        return Middleware.get(middle)
      } else {
        return middle
      }
    })
    console.log(`\t${method}\t\t${middleware.join(', ')}\t\t${this.constructor.mountPoint}${path}`)
    this.router[method](path, ...args)
  }

  get (...args) { this.route('get', ...args) }
  post (...args) { this.route('post', ...args) }
  put (...args) { this.route('put', ...args) }
  delete (...args) { this.route('delete', ...args) }

  postmiddleware () {}

  lastmiddleware () {}

  mount (Router) {
    const router = new Router({config: this.config})
    this.router.use(Router.mountPoint, router.router)
  }
}
