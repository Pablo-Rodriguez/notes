
import html from 'choo/html'

import * as styles from './style'

export default (text, modifier) => {
  const style = styles[modifier] || ''
  return html`
    <h5 class="${styles.default} ${style}">${text}</h5>
  `
}

