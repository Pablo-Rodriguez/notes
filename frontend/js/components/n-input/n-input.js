
import html from 'choo/html'

import style from './style'
import toplinebox from '../n-topline-box/n-topline-box'

export default (config) => {
  return html`
    ${toplinebox(html`
      <input ${config}/>  
    `, style)}
  `
}

