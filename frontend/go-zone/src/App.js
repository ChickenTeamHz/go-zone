import React, { Component } from 'react';
import { connect } from 'dva'
import HeaderBar from './components/HeadBar'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className="app_wrapper">
        <HeaderBar/>
        {
          this.props.children
        }
      </div>
    )
  }
}

App.propTypes = {
};

export default connect()(App);