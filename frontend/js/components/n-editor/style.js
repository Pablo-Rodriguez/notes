
import {css} from 'emotion'

import g from '../../lib/css-variables'

export default css`
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: calc(100% - 2em);

  > header {
    display: flex;
    align-items: center;

    > input[type="button"] {
      flex-basis: 10%;
      margin: 1em;
    }
  }
`

export const title = css`
  flex: 1;
  border: none;
  box-sizing: border-box;
  border-bottom: 1px solid ${g.primary.n};
  color: ${g.primary.n};
  font-size: 22px;
  padding: .5em;
  margin: .5em;
  
  &:focus {
    border-bottom: 2px solid ${g.secondary.n};
    color: ${g.secondary.n};
  }
`

export const body = css`
  flex: 1;
  padding: 1em;
  overflow: auto;

  > textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    font-size: 18px;
  }
`

export const footer = css`
  display: flex;
  justify-content: flex-end;
  > * {
    margin: 1em;
    flex-basis: 10%;
  }
`

