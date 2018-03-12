
import {css} from 'emotion'

import g from '../../lib/css-variables'

export const container = css`
  display: block;
  margin-bottom: 1em;
`

export const actions = css`
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  flex-wrap: wrap;
  > span {
    font-size: 20px;
    padding: 1em 0;
    flex: 1 1 50px;
    text-align: center;
  }
`

