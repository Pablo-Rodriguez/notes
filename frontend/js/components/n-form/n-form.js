
import html from 'choo/html'

import style from './style'
import toplinebox from '../n-topline-box/n-topline-box'

const submit = (config, emit) => (e) => {
  e.preventDefault()
  emit(config.event, e)
}

export default (config, emit, content) => {
  return html`
    ${toplinebox(html`
      <form onsubmit=${submit(config, emit)} class=${style}>${content}</form>
    `)}
  `
}
