import React, { Component } from 'react';
import { connect } from 'dva'

@connect(({ blog }) => ({ blog }))

class Blog extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>我是博客页面</div>
    )
  }
}

export default connect()(Blog)