
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  display: block;
  border-top: 4px solid ${g.secondary.n};
  box-shadow: ${g.shadow.side(2)};
  > div {
    border: 2px solid ${g.primary.n};
    border-top: none;
  }
`

