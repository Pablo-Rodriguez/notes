
export default class Router {
  constructor () {
    this.routes = {}
  }

  route (path = '', method = 'all', fn) {
    this.routes[method] = this.routes[method] || {}
    this.routes[method][path] = fn
  }

  get (path, fn) { this.route(path, 'get', fn) }
  post (path, fn) { this.route(path, 'post', fn) }
  put (path, fn) { this.route(path, 'put', fn) }
  delete (path, fn) { this.route(path, 'delete', fn) }

  handle (path = '', method = 'all', e) {
    console.log(`${method}: ${path}`)
    method = method.toLowerCase()
    const routes = this.routes[method]
    if (routes != null) {
      const match = Object.keys(routes).find(route => path.startsWith(route))
      const fn = routes[match || '']
      if (fn != null) {
        return fn(e)
      } else {
        return fetch(e.request)
      }
    } else {
      return fetch(e.request)
    }
  }
}

