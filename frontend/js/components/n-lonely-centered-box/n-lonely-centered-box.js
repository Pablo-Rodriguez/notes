
import html from 'choo/html'

import style from './style'

export default (content) => {
  return html`
    <div class=${style}>${content}</div>
  `
}
