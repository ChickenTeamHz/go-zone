import React, { Component } from 'react';
import { connect } from 'dva'
import { Form, Button, Input } from 'antd'

@connect(({ login }) => ({ login }))

class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
			form: {
				username: 'go',
				password: 'hhh123456',
			},
			confirmDirty: '',
			code: ''
		}
  }
  render() {
    return (
      <div>register</div>
    )
  }
}

export default connect()(Register)