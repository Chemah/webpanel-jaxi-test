import React, { Component, Fragment } from 'react';
import MainFrame from './components/MainFrame'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }
  
  render() {
    return (
      <Fragment>
        <MainFrame/>
      </Fragment>
    )
  }
}

export default App;