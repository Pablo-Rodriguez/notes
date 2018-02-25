
import html from 'choo/html'
import Component from 'nanocomponent'

import * as style from './style'
import toplinebox from '../n-topline-box/n-topline-box'

export default class Input extends Component {
  constructor () {
    super()
    this.state = {
      value: ''
    }
  }

  createElement (config) {
    const span = config.error != null ? html`<span>${config.error}</span>` : ''
    config.value = this.state.value
    return html`
      <div>
        ${toplinebox(html`
          <input ${config}/>  
        `, `${style.default} ${config.error != null ? style.error : ''}`)}
        ${span}
      </div>
    `
  }

  update () {
    this.state.value = this.element.querySelector('input').value
    return true
  }
}

