
import 'babel-polyfill'
import choo from 'choo'
import devtools from 'choo-devtools'

import registerSW from './lib/register-sw'
import router from './routes'
import store from './stores'

registerSW()

const app = choo()
app.use(devtools())
app.use(store)
router(app)
app.mount('#root')
