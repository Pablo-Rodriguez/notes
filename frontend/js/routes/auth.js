
export default (view, redirectRoute) => (state, emit) => {
  if (state.user.logged === true) {
    return view(state, emit)
  } else if (state.user.logged === false) {
    emit(state.events.REPLACESTATE, redirectRoute)
  } else {
    emit(state.events.user.GET_SESSION)
  }
  return document.createElement('div')
}

