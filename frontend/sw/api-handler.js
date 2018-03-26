
import Router from './router'

export default function createRouter (sw) {
  const router = new Router()

  router.get('/api/session', (e) => {
    sw.staleWhileRevalidate(e)
  })

  router.post('/api/logout', (e) => {
    sw.fetchOrNetworkError(e)
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

