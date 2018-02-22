
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  cursor: pointer;
  display: block;
  margin: 0 auto;
  color: ${g.secondary.d};
  border: 2px solid ${g.primary.n};
  background-color: ${g.white};
  box-shadow: ${g.shadow.side(2)};
  font-size: 16px;
  padding: .5em;

  &:hover {
    box-shadow: ${g.shadow.side(4)};
  }

  &:active {
    box-shadow: none;
    border-color: ${g.secondary.n};
  }
`

