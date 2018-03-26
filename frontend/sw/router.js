
export default class Router {
  constructor () {
    this.routes = {}
  }

  route (path = '', method = 'all', fn) {
    this.routes[path] = this.routes[path] || {}
    this.routes[path][method] = fn
  }

  get (path, fn) { this.route(path, 'get', fn) }
  post (path, fn) { this.route(path, 'post', fn) }
  put (path, fn) { this.route(path, 'put', fn) }
  delete (path, fn) { this.route(path, 'delete', fn) }

  handle (path = '', method = 'all', e) {
    console.log(`${method}: ${path}`)
    method = method.toLowerCase()
    const route = this.routes[path]
    if (route != null) {
      const fn = route[method]
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

