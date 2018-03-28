
import html from 'choo/html'

import style from './style'
import note from '../n-note/n-note'

const listNote = (data) => html`<li data-id="${data.id}">${note(data)}</li>`

export default (state, emit) => {
  const notes = state.getIfIsNot(() => state.notes.data, null, [])
    .filter(note => !note.deleted)
    .filter(note => note.title.startsWith(state.notes.filter))
    .sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
    .map(markSelected(state))
  return html`
    <ul class=${style} onclick=${selectNote(state, emit)}>
      ${notes.map(listNote)}
    </ul>
  `
}

const markSelected = (state) => (note) => {
  const id = state.getIfIsNot(() => state.notes.selected.id, null)
  note.selected = note.id === id
  return note
}

function getLIParent (target) {
  if (target.parentNode && target.parentNode.tagName) {
    if (target.parentNode.tagName.toLowerCase() === 'li') {
      return target.parentNode
    } else {
      return getLIParent(target.parentNode)
    }
  } else {
    return null
  }
}

const selectNote = (state, emit) => (e) => {
  e.preventDefault()
  const li = getLIParent(e.target)
  if (li != null) {
    emit(state.events.notes.SELECT_NOTE, li.getAttribute('data-id'))
  }
}

