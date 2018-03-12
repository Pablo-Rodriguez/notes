
import {css} from 'emotion'

export default css`
  display: flex;
  height: 90vh;
  width: 90vw;
  margin: 0 auto;
  margin-top: 5vh;
  align-items: stretch;
  > aside {
    flex: 1 1 20%;
    margin-right: 1em;
    overflow-x: hidden;
    > div {
      height: 90vh;
      width: 100%;
      padding-right: 1em;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  > section {
    flex: 1 1 80%;
    margin-left: 1em;
    > div {
      height: calc(100% - 4px);
      > div {
        height: 100%;
      }
    }
  }
`

