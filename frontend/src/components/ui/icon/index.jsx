
import React from 'react'

import A from './style'

export default class Icon extends React.Component {
  render () {
    return (
      <A className={this.props.type} />
    )
  }
}
