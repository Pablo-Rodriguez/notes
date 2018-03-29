
import html from 'choo/html'

import {container, actions} from './style'
import toplinebox from '../n-topline-box/n-topline-box'
import icon from '../n-icon/n-icon'
import {prevent} from '../../lib/util'

export default (state, emit) => {
  const icons = createIconConfig(state, emit)
  return html`<aside class=${container}>
    ${toplinebox(html`
      <div class=${actions}>
        ${icons.map(config => icon(config.name, config.type, {onclick: config.onclick, title: config.title}))}
      </div>
    `)}
  </aside>`
}

function createIconConfig (state, emit) {
  return [
    {
      name: 'add',
      type: '',
      title: 'Create note',
      onclick: prevent((e) => {
        emit(state.events.notes.ADD_NOTE)
      })
    }, {
      name: 'delete',
      title: 'Delete note',
      type: state.getIfIsNot(() => state.notes.selected, null) != null ? 'danger' : 'disabled',
      onclick: prevent((e) => {
        if (state.notes.selected != null) {
          emit(state.events.notes.DELETE_NOTE)
        }
      })
    }, {
      name: 'export',
      type: '',
      title: 'Export notes in JSON format',
      onclick: prevent((e) => {
        emit(state.events.notes.EXPORT_NOTES)
      })
    }, {
      name: 'exit',
      type: '',
      title: 'Log out (this will remove all locally-saved data)',
      onclick: prevent((e) => {
        emit(state.events.user.LOGOUT)
      })
    }
  ]
}

