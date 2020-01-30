import React, { Component } from 'react';
import { connect } from 'dva'
import HeaderBar from '../components/HeadBar'

class BasicLayout extends Component {
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

BasicLayout.propTypes = {
};

export default connect()(BasicLayout);