
import 'babel-polyfill'

import {VERSION, STATIC_CACHE, DYNAMIC_CACHE, ASSETS} from './config'
import SW from './SW'
import createAPIHandler from './api-handler'

const sw = new SW(self, VERSION)
const apiHandler = createAPIHandler(sw)
sw.init(STATIC_CACHE, DYNAMIC_CACHE, ASSETS)

sw.onfetch(e => {
  try {
    const path = e.parsedURL.pathname
    if (path.startsWith('/static')) {
      return sw.cacheFirst(e)
    } else if (path.startsWith('/api')) {
      return apiHandler.handle(path, e.request.method, e)
    } else {
      return sw.staleWhileRevalidate(e)
    }
  } catch (error) {
    console.log(error)
  }
})

