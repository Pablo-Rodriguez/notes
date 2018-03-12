
import html from 'choo/html'

import style from './style'

export default (icon, type = '', config = {}) => {
  return html`
    <span
      class="icon ${typeof icon === 'string' ? `icon-${icon}` : ''} ${style}"
      data-type="${type}"
      ${config}
    ></span>
  `
}

