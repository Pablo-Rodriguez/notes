
import 'babel-polyfill'
import choo from 'choo'
import devtools from 'choo-devtools'

import router from './routes'
import store from './stores'

const app = choo()
app.use(devtools())
app.use(store)
router(app)
app.mount('#root')
