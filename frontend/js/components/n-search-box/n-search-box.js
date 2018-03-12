
import html from 'choo/html'
import debounce from 'debounce'

import style from './style'
import toplinebox from '../n-topline-box/n-topline-box'

const oninput = (state, emit) => debounce(
  (e) => emit(state.events.notes.FILTER_CHANGE, e.target.value))

export default (state, emit) => {
  return html`<div class=${style}>
    ${toplinebox(html`
      <input placeholder="Search..." oninput=${oninput(state, emit)} value=${state.notes.filter}/>
    `)}
  </div>`
}

