
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
  > footer {
    margin: .5em;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    justify-content: space-between;
    .note-date {
      flex: 5;
      white-space: nowrap;
      color: ${g.primary.n};
    }
    .note-icons {
      display: flex;
      flex: 1;
      justify-content: space-around;
      > * {
        padding: .5em;
      }
    }
  }
  &:hover {
    box-shadow: ${g.shadow.side(5)};
  }
  &[data-selected="true"] {
    background: ${g.light};
  }
`

