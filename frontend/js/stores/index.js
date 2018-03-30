
import uuid from 'uuid/v4'

import initial from './initial-state'
import user from './user'
import notes from './notes'
import resize from './resize'
import * as types from './types'
import * as api from '../api'
import stateUtil from '../lib/state-util'
import * as util from '../lib/util'

export default (state, bus) => {
  const reducers = [
    user({api: api.Account, handlers: api.handlers}),
    notes({api: api.Notes, handlers: api.handlers, uuid, util}),
    resize()
  ]

  Object.assign(state, initial)
  Object.assign(state.events, types)
  Object.assign(state, stateUtil)
  reducers.forEach(reducer => reducer(state, bus))
}

