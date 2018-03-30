
import Router from './router'

export default function createRouter (sw) {
  const router = new Router()

  router.post('/api/login', (e) => {
    sw.fetchOrNetworkError(e)
  })

  router.post('/api/signup', (e) => {
    sw.fetchOrNetworkError(e)
  })

  router.get('/api/session', (e) => {
    sw.staleWhileRevalidate(e, {error: true, code: 403, data: {}}, {status: 403})
  })

  router.post('/api/logout', async (e) => {
    sw.fireAndForget(e)
    e.waitUntil(async function () {
      try {
        const cache = await caches.open(sw.DYNAMIC_CACHE)
        const requests = await cache.keys()
        const session = requests.find(
          request => request.method.toLowerCase() === 'get' && request.url.includes('/api/session'))
        if (session != null) {
          cache.delete(session)
        }
      } catch (error) {/*Eat errors*/}
    }())
  })

  router.get('/api/note', (e) => {
    sw.fetchOrNetworkError(e)
  })

  router.put('/api/note', (e) => {
    sw.fetchOrNetworkError(e)
  })

  router.delete('/api/note', (e) => {
    sw.fetchOrNetworkError(e)
  })

  return router
}

