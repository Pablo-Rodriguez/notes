
import html from 'choo/html'
import debounce from 'debounce'
import remark from 'remark'
import remarkHTML from 'remark-html'

import {default as style, title, body, footer} from './style'
import toplinebox from '../n-topline-box/n-topline-box'
import button from '../n-button/n-button'

// TODO -> refactorizar y mover cosas a n-editor/components.js o similar

const save = (state, emit) => (e) => {
  e.preventDefault()
  emit(state.events.notes.SAVE_NOTE)
}
const saveButton = (state, emit) =>html`
  <input class=${button} type="button" value="Save" onclick=${save(state, emit)}/>`

const changeView = (state, emit) => (e) => {
  e.preventDefault()
  emit(state.events.notes.CHANGE_VIEW)
}
const changeViewButton = (state, emit) => html`
  <input class=${button} type="button" value="Preview" onclick=${changeView(state, emit)}/>`

const change = (state, emit) => debounce((e) => {
  const field = e.target && e.target.getAttribute('data-field')
  if (field != null) {
    const note = {
      [field]: e.target.value
    }
    emit(state.events.notes.NOTE_CHANGE, note)
  }
}, 600)

const textarea = (state) => {
  const el = html`<textarea data-field="body" placeholder="Your note body..."></textarea>`
  el.value = state || ''
  return el
}

const preview = (body = '') => {
  const container = html`<div class="markdown-body"></div>`
  remark().use(remarkHTML).process(body, (err, file) => {
    container.innerHTML = file
  })
  return container
}

const editor = (state, note, onchange, emit) => html`<div class=${style} oninput=${onchange}>
  <header data-id="${note.id}">
    <input class="${title}" data-field="title" placeholder="Your note title..." value="${note.title || ''}">
    ${saveButton(state, emit)}
  </header>
  <article class=${body}>
    ${state.notes.preview ? preview(note.body) : textarea(note.body)}
  </article>
  <footer class=${footer}>
    ${changeViewButton(state, emit)}
    ${saveButton(state, emit)}
  </footer>
</div>`

export default (state, emit) => {
  const content = state.notes.selected != null ?
    editor(state, state.notes.selected, change(state, emit), emit) :
    html`<div class=${style}></div>`
  return html`<section>
    ${toplinebox(content)}
  </section>`
}

