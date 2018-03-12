
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  display: block;
  overflow: hidden;
  cursor: pointer;
  .note-title {
    font-size: 20px;
    margin: .5em;
    color: ${g.secondary.n};
    font-weight: normal;
  }
  .note-body {
    font-size: 16px;
    color: ${g.dark};
    margin: .5em;
    text-align: justify;
  }
  .note-date {
    color: ${g.primary.n};
    margin-right: .5em;
  }
  &:hover {
    box-shadow: ${g.shadow.side(5)};
  }
  &[data-selected="true"] {
    background: ${g.light};
  }
`

