
export default ({api, handlers}) => (state, bus) => {
  const types = state.events.user
  const user = state.user
  
  bus.on(types.SUBMIT_SIGNUP, async (e) => {
    try {
      clearAndChangeToLoading(state, bus)
      const response = await api.signup(e.name.value, e.password.value, e.repeat.value)
      user.loading = false
      bus.emit(state.events.PUSHSTATE, '/login')
    } catch (e) {
      handlers.handleErrors(state, bus, user, e)
    }
  })

  bus.on(types.SUBMIT_LOGIN, async (e) => {
    try {
      clearAndChangeToLoading(state, bus)
      const response = await api.login(e.name.value, e.password.value)
      user.loading = false
      bus.emit(state.events.PUSHSTATE, '/')
    } catch (e) {
      handlers.handleErrors(state, bus, user, e)
    }
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

