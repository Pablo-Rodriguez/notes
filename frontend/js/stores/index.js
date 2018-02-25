
import initial from './initial-state'
import user from './user'
import * as types from './types'
import * as api from '../api'
import stateUtil from '../lib/state-util'

export default (state, bus) => {
  const reducers = [
    user({api: api.Account, handlers: api.handlers})
  ]

  Object.assign(state, initial)
  Object.assign(state.events, types)
  Object.assign(state, stateUtil)
  reducers.forEach(reducer => reducer(state, bus))
}

