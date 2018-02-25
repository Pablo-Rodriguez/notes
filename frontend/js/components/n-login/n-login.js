
import html from 'choo/html'

import style from './style'
import lonelybox from '../n-lonely-centered-box/n-lonely-centered-box'
import form from '../n-form/n-form'
import Input from '../n-input/n-input'
import button from '../n-button/n-button'
import link from '../n-link/n-link'
import message from '../n-message/n-message'

const formConfig = (state) => ({event: state.events.user.SUBMIT_LOGIN})
const inputs = [new Input(), new Input()]

export default (state, emit) => {
  const inputsConfig = loginInputs(state)
  let msg = state.getIfIsNot(() => state.user.error.message, null)
  msg = msg != null ? message(msg, 'error') : ''

  return html`
    ${lonelybox(html`
      <div>
        ${form(formConfig(state), emit, html`
          <div class=${style}>
            <h2>Login</h2>
            ${msg}
            ${inputs.map((input, i) => input.render(inputsConfig[i]))}
            <input class=${button} type="submit" value="Send"/>
          </div>
        `)}
        <a class=${link} href="/signup">Don't have an account yet?</a>
      </div>
    `)}
  `
}

function loginInputs (state) {
  const {user} = state
  return [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Username',
      error: null
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      error: null
    }
  ]
}

