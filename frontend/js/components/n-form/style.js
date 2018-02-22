
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  display: block;
  padding: 0 1em 1em 1em;
  text-align: center;
  overflow: hidden;

  h2 {
    font-weight: normal;
    font-size: 26px;
    color: ${g.secondary.d};
    margin: .8em auto;
  }
`
