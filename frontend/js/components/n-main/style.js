
import {css} from 'emotion'

import {phablet, desktop} from '../../lib/media-queries'

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

  ${desktop} {
    > aside {
      margin-right: 0;
      overflow: auto;
      overflow-y: scroll;
      > div {
        height: auto;
        width: auto;
        overflow: auto;
      }
    }
    > section {
      margin-left: 0;
    }
  }

  ${phablet} {
    display: block;
    margin: 0;
    height: calc(100vh - 2em);
    width: 100vw;
    padding: 1em;
    padding-right: 0;
    overflow-x: hidden;
    overflow-y: hidden;
    > aside {
      overflow-x: hidden;
      width: 100%;
      padding-right: 2em;
      width: calc(100vw - 2em);
      > div {
        padding-right: 1em;
        width: calc(100vw - 2em);
      }
    }
  }
  
  &[data-aside-hidden="true"] {
    > aside {
      display: none;
    }
    padding-right: 1em;
    width: calc(100vw - 2em);

    ${desktop} {
      padding-right: 0;
    }

    ${phablet} {
      display: flex;
      > section {
        min-width: 0px;
        flex-basis: 0px;
      }
    }
  }
`

