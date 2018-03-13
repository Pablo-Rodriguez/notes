
import html from 'choo/html'
import remark from 'remark'
import remarkHTML from 'remark-html'

import {default as style, title, body, footer} from './style'
import {onSave, onChange, onViewChange} from './behavior'
import button from '../n-button/n-button'

export function editor (state, note, emit) {
  return html`
    <div class=${style} oninput=${onChange(state, emit)}>
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
    </div>
  `
}

export const empty = () => html`<div class=${style}></div>`

const saveButton = (state, emit) => html`
  <input class=${button} type="button" value="Save" onclick=${onSave(state, emit)}/>`

const changeViewButton = (state, emit) => html`
  <input class=${button} type="button" value="Preview" onclick=${onViewChange(state, emit)}/>`

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

