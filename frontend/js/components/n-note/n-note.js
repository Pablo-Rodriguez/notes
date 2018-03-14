
import html from 'choo/html'

import {parseDate} from '../../lib/dates'
import style from './style'
import toplinebox from '../n-topline-box/n-topline-box'

function parseBody (body) {
  const arr = body.split(' ')
  return arr.length > 25 ? arr.slice(0, 25).join(' ') + '...' : arr.join(' ')
}

export default (note) => {
  return toplinebox(html`<div class=${style} data-selected=${note.selected}>
    <h4 class="note-title">${note.title}</h4>
    <p class="note-body">
      <b class="note-date">${parseDate(note.updatedAt)}</b>${parseBody(note.body)}
    </p>
  </div>`)
}

