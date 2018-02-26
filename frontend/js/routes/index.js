
import login from '../components/n-login/n-login'
import signup from '../components/n-signup/n-signup'
import main from '../components/n-main/n-main'
import notfound from '../components/n-notfound/n-notfound'

import auth from './auth'

export default (app) => {
  app.route('/', auth(main, '/login'))
  app.route('/login', login)
  app.route('/signup', signup)
  app.route('/not-found', notfound)
  app.route('*', (state, emit) => {
    emit(state.events.REPLACESTATE, '/not-found')
    return notfound(state, emit)
  })
}
