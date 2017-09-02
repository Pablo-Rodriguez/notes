
import React from 'react'

import Section from './style'
import TextInputWithButton from '../text-input-with-button/'

export default class Sidebar extends React.Component {
  render () {
    return (
      <Section>
        <TextInputWithButton />
      </Section>
    )
  }
}
