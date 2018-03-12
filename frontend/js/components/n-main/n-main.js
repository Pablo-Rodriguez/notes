
import html from 'choo/html'

import style from './style'
import searchbox from '../n-search-box/n-search-box'
import actions from '../n-actions/n-actions'
import list from '../n-notes-list/n-notes-list'
import editor from '../n-editor/n-editor'

export default (state, emit) => {
  return html`
    <div class=${style}>
      <aside>
        <div>
          ${searchbox(state, emit)}
          ${actions(state, emit)}
          ${list(state, emit)}
        </div>
      </aside>
      ${editor(state, emit)}
    </div>
  `
}
