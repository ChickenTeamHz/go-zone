import React, { Component } from 'react';
import { connect } from 'dva'
import BlogWrapper from '../../components/Blog/blogWrapper'

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
      <BlogWrapper />
    )
  }
}

export default connect()(Blog)