
import html from 'choo/html'

import {container, actions} from './style'
import toplinebox from '../n-topline-box/n-topline-box'
import icon from '../n-icon/n-icon'

export default (state, emit) => {
  const icons = createIconConfig(state, emit)
  return html`<aside class=${container}>
    ${toplinebox(html`
      <div class=${actions}>
        ${icons.map(config => icon(config.name, config.type, {onclick: config.onclick}))}
      </div>
    `)}
  </aside>`
}

const prevent = (fn) => (e) => {
  e.preventDefault()
  fn(e)
}

function createIconConfig (state, emit) {
  return [
    {
      name: 'add',
      type: '',
      onclick: prevent((e) => {
        emit(state.events.notes.ADD_NOTE)
      })
    }, {
      name: 'delete',
      type: state.getIfIsNot(() => state.notes.selected, null) != null ? 'danger' : 'disabled',
      onclick: prevent((e) => {
        if (state.notes.selected != null) {
          emit(state.events.notes.DELETE_NOTE)
        }
      })
    }, {
      name: 'export',
      type: '',
      onclick: prevent((e) => {
        emit(state.events.notes.EXPORT_NOTES)
      })
    }, {
      name: 'import',
      type: '',
      onclick: prevent((e) => {console.log('import')})
    }
  ]
}

