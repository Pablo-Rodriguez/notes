
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  margin: 1em 0;
  input {
    display: block;
    border: none;
    font-size: 16px;
    padding: .5em;
    width: calc(100% - 1em);
  }
  span {
    color: ${g.error};
  }
`
export const error = css`
  border-color: ${g.error};
`
