
import NotesService from '../services/notes'

export default ({api, handlers}) => (state, bus) => {
  const types = state.events.user
  const user = state.user
  const notesService = new NotesService(state, bus)

  bus.on(state.events.NAVIGATE, () => {
    user.error = null
  })

  bus.on(types.SUBMIT_SIGNUP, async (e) => {
    try {
      clearAndChangeToLoading(state, bus)
      const response = await api.signup(e.name.value, e.password.value, e.repeat.value)
      user.loading = false
      bus.emit(state.events.PUSHSTATE, '/login')
    } catch (error) {
      handlers.handleErrors(state, bus, user, error)
    }
  })

  bus.on(types.SUBMIT_LOGIN, async (e) => {
    try {
      clearAndChangeToLoading(state, bus)
      const response = await api.login(e.name.value, e.password.value)
      user.loading = false
      user.logged = true
      user.data = response.data
      api.session() // We need this to be cached in the service worker so we fire and forget
      bus.emit(types.LOGGED_IN)
      bus.emit(state.events.PUSHSTATE, '/')
    } catch (error) {
      handlers.handleErrors(state, bus, user, error)
    }
  })

  bus.on(types.GET_SESSION, async (e) => {
    try {
      clearUser(user)
      const response = await api.session()
      user.data = response.data
      user.logged = true
      bus.emit(types.LOGGED_IN)
      bus.emit(state.events.RENDER)
    } catch (error) {
      handlers.handleErrors(state, bus, user, error)
    }
  })

  bus.on(types.LOGOUT, (e) => {
    clearUser(user)
    notesService.removeLocalData()
    api.logout()
    bus.emit(state.events.REPLACESTATE, '/login')
    bus.emit(state.events.RENDER)
  })
}

function clearAndChangeToLoading (state, bus) {
  clearUser(state.user)
  state.user.loading = true
  bus.emit(state.events.RENDER)
}

function clearUser (user) {
  user.error = null
  user.data = null
  user.loading = false
  user.logged = false
}

