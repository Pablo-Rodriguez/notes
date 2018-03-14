
import fetch from 'isomorphic-fetch'
import queryString from 'query-string'

const Headers = global.Headers
const baseURL = '/api'
const url = (path) => `${baseURL}${path}`

export class Base {
  static get useCSRF () {
    return false
  }

  static async getToken () {
    if (Base._csrf != null) {
      return Promise.resolve(Base._csrf)
    } else {
      return Base.fetchToken()
    }
  }

  static async fetchToken () {
    const response = await fetch(url('/csrf'), {
      credentials: 'include'
    })
    const {data} = await response.json()
    Base._csrf = data.token
    return data.token
  }

  static async get (path, query) {
    const response = await fetch(url(`${path}?${queryString.stringify(query)}`), {
      credentials: 'include'
    })
    const data = await response.json()
    return data
  }

  static async _bodyVerbs (method = 'POST', path, body = {}) {
    let response = await fetch(url(path), {
      method,
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      credentials: 'include',
      body: JSON.stringify(body)
    })
    return await response.json()
  }

  static async _complexBodyVerbs (method, path, body = {}) {
    if (Base.useCSRF) {
      body._csrf = await Base.getToken()
      let response = await Base._bodyVerbs(method, path, body)
      if (response.code && response.code === 403) {
        body._csrf = await Base.fetchToken()
        return await Base._bodyVerbs(method, path, body)
      } else {
        return response
      }
    } else {
      return Base._bodyVerbs(method, path, body)
    }
  }

  static post (path, body = {}) {
    return Base._complexBodyVerbs('POST', path, body)
  }

  static async put (path, body = {}) {
    return Base._complexBodyVerbs('PUT', path, body)
  }

  static async delete (path, body = {}) {
    return Base._complexBodyVerbs('DELETE', path, body)
  }
}

async function throwOnError (request) {
  const response = await request
  if (response.error === false) {
    return response
  } else {
    throw response
  }
}

function CRUD (base) {
  return class CRUD {
    static async get (query) {
      return Base.get(`${base}`, query)
    }

    static async getOne (id, query) {
      return Base.get(`${base}/${id}`, query)
    }

    static async create (body) {
      return Base.post(`${base}`, body)
    }

    static async edit (body) {
      return Base.put(`${base}/${body.id}`, body)
    }

    static async delete (id) {
      return Base.delete(`${base}/${id}`)
    }
  }
}

export class Account {
  static async login (name, password) {
    return throwOnError(Base.post('/login', {name, password}))
  }

  static async signup (name, password, repeat) {
    if (password === repeat) {
      return throwOnError(Base.post('/signup', {name, password}))
    } else {
      throw {error: true, data: { message: '"Password" and "Repeat password" must be the same.' }}
    }
  }

  static async session () {
    return throwOnError(Base.get('/session'))
  }

  static async logout () {
    return throwOnError(Base.post('/logout'))
  }
}

export class Notes {
  static fetch () {
    return throwOnError(Base.get('/note'))
  }

  static save (note) {
    return throwOnError(Base.put('/note', note))
  }

  static delete (id) {
    return throwOnError(Base.delete(`/note/${id}`))
  }
}

export const handlers = {
  networkError: {
    message: 'You are in offline mode'
  },
  handleErrors: (state, bus, substate, e) => {
    switch (e.code) {
      case 400:
        if (e.data != null) {
          e.data.fields = e.data.fields || []
          substate.error = e.data
          substate.error.fields = substate.error.fields.reduce((acc, field) => {
            acc[field.field] = field
            return acc
          }, {})
        } else {
          substate.error = handlers.networkError
        }
        bus.emit(state.events.RENDER)
        break
      case 403:
        bus.emit(state.events.user.LOGOUT)
        break
      default:
    }
  }
}

