import React, { Component } from 'react';
import { connect } from 'dva'
import HeaderBar from '../components/HeadBar'

class MainLayout extends Component {
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

MainLayout.propTypes = {
};

export default connect()(MainLayout);