
import html from 'choo/html'

import toplinebox from '../n-topline-box/n-topline-box'
import {editor, empty} from './pieces'

export default (state, emit) => {
  return html`
    <section>
      ${toplinebox(getContent(state, emit))}
    </section>
  `
}

function getContent (state, emit) {
  if (state.notes.selected != null) {
    return editor(state, state.notes.selected, emit)
  } else {
    return empty()
  }
}

