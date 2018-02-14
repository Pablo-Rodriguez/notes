
import html from 'choo/html'

import style from './style'

const submit = (config, emit) => (e) => {
  e.preventDefault()
  emit(config.event, e)
}

export default (config, emit, content) => {
  return html`
    <form onsubmit=${submit(config, emit)} class=${style}>${content}</form>
  `
}
