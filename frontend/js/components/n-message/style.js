
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  display: block;
  font-weight: normal;
  font-size: 18px;
  border: 2px solid ${g.primary.n};
  color: ${g.primary.n};
  background-color: ${g.white};
  box-shadow: ${g.shadow.side(2)};
  padding: .5em;
`

export const error = css`
  border-color: ${g.error};
  color: ${g.error};
`

