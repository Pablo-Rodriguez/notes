
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  display: block;
  margin-bottom: 1em;
  input {
    margin: 1em;
    width: calc(100% - 2em);
    border: 2px solid ${g.primary.n};
    border-radius: 500px;
    box-sizing: border-box;
    padding: .3em 1em;
    color: ${g.primary.n};
  }

  input:focus {
    outline: 0;
    border-color: ${g.secondary.n};
    color: ${g.secondary.n};
  }
`

