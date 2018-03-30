
import debounce from 'debounce'

import {prevent} from '../../lib/util'

export const onSave = (state, emit) => prevent((e) => {
  emit(state.events.notes.SAVE_NOTE)
})

export const onChange = (state, emit) => debounce((e) => {
  const field = e.target && e.target.getAttribute('data-field')
  if (field != null) {
    const note = {
      [field]: e.target.value
    }
    emit(state.events.notes.NOTE_CHANGE, note)
  }
}, 600)

export const removeSelection = (state, emit) => prevent((e) => {
  emit(state.events.notes.REMOVE_SELECTION)
})

export const onViewChange = (state, emit) => prevent((e) => {
  emit(state.events.notes.CHANGE_VIEW)
})

export const deleteNote = (state, emit) => prevent((e) => {
  emit(state.events.notes.DELETE_NOTE)
})

