
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  display: block;
  cursor: pointer;
  
  color: ${g.primary.n};
  &:hover {
    color: ${g.primary.d};
    background: ${g.light};
  }

  &[data-type="disabled"] {
    color: ${g.gray};
    cursor: default;
    background: ${g.white};
  }

  &[data-type="danger"] {
    color: ${g.error};
    cursor: pointer;
    &: hover {
      background: ${g.light};
    }
  }
`

