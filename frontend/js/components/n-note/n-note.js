
import html from 'choo/html'

import {parseDate} from '../../lib/dates'
import style from './style'
import toplinebox from '../n-topline-box/n-topline-box'
import icon from '../n-icon/n-icon'

function parseBody (body) {
  const arr = body.split(' ')
  return arr.length > 25 ? arr.slice(0, 25).join(' ') + '...' : arr.join(' ')
}

export default (note) => {
  const icons = createIcons(note)
  return toplinebox(html`<div class=${style} data-selected=${note.selected}>
    <h4 class="note-title">${note.title}</h4>
    <p class="note-body">
      ${parseBody(note.body)}
    </p>
    <footer>
      <b class="note-date">${parseDate(note.updatedAt)}</b>
      <div class="note-icons">
        ${icons}
      </div>
    </footer>
  </div>`)
}

function createIcons (note) {
  return [
    icon('check', note.saved ? 'primary' : 'disabled', {
      title: 'If is green, this note is saved locally'
    }),
    icon('save', note.sync ? 'primary' : 'disabled', {
      title: 'If is green, this note is saved remotely'
    })
  ]
}

