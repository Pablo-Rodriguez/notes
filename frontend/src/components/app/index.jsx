
import React from 'react'

import Div from './style'

import Sidebar from '../ui/sidebar/'
import MainContent from '../ui/main-content/'

export default class App extends React.Component {
  render () {
    return (
      <Div>
        <div className='side'>
          <Sidebar />
        </div>
        <div className='main'>
          <MainContent />
        </div>
      </Div>
    )
  }
}
