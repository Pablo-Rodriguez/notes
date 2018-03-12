
import html from 'choo/html'

import style from './style'
import lonelybox from '../n-lonely-centered-box/n-lonely-centered-box'
import form from '../n-form/n-form'
import message from '../n-message/n-message'
import Input from '../n-input/n-input'
import button from '../n-button/n-button'
import link from '../n-link/n-link'

const formConfig = (state) => ({event: state.events.user.SUBMIT_SIGNUP})
const inputs = [new Input(), new Input(), new Input()]

export default (state, emit) => {
  const inputsConfig = signupInputs(state)
  let msg = state.getIfIsNot(() => state.user.error.message, null)
  msg = msg != null ? message(msg, 'error') : ''

  return html`
    ${lonelybox(html`
      <div>
        ${form(formConfig(state), emit, html`
          <div class=${style}>
            <h2>Signup</h2>
            ${msg}
            ${inputs.map((input, i) => input.render(inputsConfig[i]))}
            <input class=${button} type="submit" value="Send"/>
          </div>
        `)}
        <a class=${link} href="/login">Do you already have an account?</a>
      </div>
    `)}
  `
}

function signupInputs (state) {
  const {user} = state
  return [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Username',
      autofocus: true,
      error: state.getIfIsNot(() => user.error.fields.name.message, null)
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      error: state.getIfIsNot(() => user.error.fields.password.message, null)
    },
    {
      name: 'repeat',
      type: 'password',
      placeholder: 'Repeat password',
      error: state.getIfIsNot(() => user.error.fields.repeat.message, null)
    }
  ]
}

