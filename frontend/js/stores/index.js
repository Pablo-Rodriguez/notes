
import initial from './initial-state'
import user from './user'
import * as types from './types'

export default (state, bus) => {
  const reducers = [
    user({})
  ]

  Object.assign(state, initial)
  Object.assign(state.events, types)
  reducers.forEach(reducer => reducer(state, bus))
}

