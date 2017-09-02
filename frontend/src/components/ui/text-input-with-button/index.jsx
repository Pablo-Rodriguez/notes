
import React from 'react'

import Div from './style'
import Input from '../input/'
import Icon from '../icon/'

export default class TextInputWithButton extends React.Component {
  render () {
    return (
      <Div>
        <Input type='text' />
        <Icon />
      </Div>
    )
  }
}
