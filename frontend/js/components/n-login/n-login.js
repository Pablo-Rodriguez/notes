
import html from 'choo/html'

import style from './style'
import lonelybox from '../n-lonely-centered-box/n-lonely-centered-box'
import form from '../n-form/n-form'

const lonelyform = (state, emit, content) =>
  lonelybox(form({event: state.events.user.SUBMIT_LOGIN}, emit, content))

export default (state, emit) => {
  return html`
    ${lonelyform(state, emit, html`
      <div class=${style}>
        <input type="submit" value="enviar" />
      </div>
    `)}
  `
}
