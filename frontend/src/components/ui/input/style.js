
import styled from 'styled-components'

export default styled.input`
  ${getStyles}
`

function getStyles (props) {
  switch (props.type || 'text') {
    case 'text':
      return `
        padding: .5em 1em;
        border: 1px solid #777;
        border-radius: 50px;
        &:focus {
          outline: 0;
          border-color: lightgreen;
        }
      `
    case 'button':
      return ``
    default:
      return ''
  }
}
