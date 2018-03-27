
import nanobus from 'nanobus'

export default class SW {
  constructor (self, VERSION) {
    this.self = self
    this.VERSION = VERSION
  }

  init (STATIC_CACHE, DYNAMIC_CACHE, ASSETS) {
    this.STATIC_CACHE = STATIC_CACHE
    this.DYNAMIC_CACHE = DYNAMIC_CACHE
    this.ASSETS = ASSETS

    this.self.oninstall = e => e.waitUntil(async function () {
      const cache = await caches.open(STATIC_CACHE)
      await cache.addAll(ASSETS)
      console.log('Service worker installed and assets cached')
      return self.skipWaiting()
    }())

    this.self.onactive = e => {
      e.waitUntil(
        caches.keys()
          .then(keys => keys.filter(key => !key.startsWith(this.VERSION)))
          .then(staleKeys => Promise.all(
            staleKeys.map(key => caches.delete(key))
          ))
      )
      return this.self.clients.claim()
    }
  }

  onfetch (fn) {
    this.self.onfetch = e => {
      e.parsedURL = new URL(e.request.url)
      fn(e)
    }
  }

  fetch (e) {
    e.respondWith(fetch(e.request))
  }

  response (body, init) {
    return new Response(JSON.stringify(body), init)
  }

  fetchOrNetworkError (e) {
    e.respondWith(async function () {
      try {
        const fetched = await fetch(e.request)
        return fetched
      } catch (error) {
        return this.response({error: true, code: 0}, {status: 200})
      }
    }.call(this))
  }

  cacheFirst (e) {
    const bus = nanobus()
    const toBeCache = new Promise((resolve, reject) => {
      bus.on('cache', resolve)
      bus.on('no-cache', reject)
    })
    e.respondWith(async function () {
      try {
        const cached = await cached
        if (cached != null) {
          return cached
        } else {
          const fetched = fetch(e.request)
          const fetchedCopy = fetched.then(response => response.clone())
          const response = await fetched
          bus.emit('cache', fetchedCopy)
          return fetched
        }
      } catch (error) {
        bus.emit('no-cached')
      }
    }())

    e.waitUntil(async function () {
      try {
        const response = await toBeCache
        if (response != null) {
          const cache = await caches.open(this.STATIC_CACHE)
          return cache.put(e.request, response)
        } else {
          return
        }
      } catch (error) {/*eat errors*/}
    }.call(this))
  }

  staleWhileRevalidate (e) {
    const fetched = fetch(e.request)
    const fetchedCopy = fetched.then(response => response.clone())
    const cached = caches.match(e.request)

    e.respondWith(async function () {
      try {
        const response = await Promise.race([
          fetched.catch(_ => cached),
          cached
        ])

        return response || await fetched
      } catch (error) {
        console.log(error)
        return new Response(null, {status: 404})
      }
    }.call(this))

    e.waitUntil(async function () {
      try {
        const response = await fetchedCopy
        const cache = await caches.open(this.DYNAMIC_CACHE)
        return cache.put(e.request, response)
      } catch (error) {
        // In offline mode fetch failes and we want to eat this error
        // because we cannot cache a bad response, but is not a real error.
      }
    }.call(this))
  }
}

