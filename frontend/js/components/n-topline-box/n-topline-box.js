
import html from 'choo/html'

import style from './style'

export default (content, otherStyle = '') => {
  return html`
    <div class="${style} ${otherStyle}">
      <div>
        ${content}
      </div>
    </div>
  `
}

