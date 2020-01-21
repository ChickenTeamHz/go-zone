import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './index.scss'
import { Form, Button, Input } from 'antd'

@connect(({ login }) => ({ login }))

class LoginPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			form: {
				username: 'go',
				password: 'hhh123456',
			},
			code: ''
		}
	}

	componentDidMount() {
		console.log(this.props)
		this.getVerifyCode()
	}

	resetForm() {
		this.setState({
			form: {
				userName: '',
				passWord: ''
			}
		})
	}

	getVerifyCode = () => {
		this.props.dispatch({
			type: 'login/getCode',
			payload: this.state.form
		}).then(res => {
			this.setState({
				code: res
			})
		})
	}

	subForm() {
		let { type } = this.props.login
		let effectsType = 'login/login'

		if (type !== 1) {
			effectsType = 'login/register'
		}

		this.props.dispatch({
			type: effectsType,
			payload: this.state.form
		}).then(res => {

		})
	}

	handleInput = (e) => {
		let target = e.target
		let key = target.name

		this.setState({
			form: {
				...this.state.form,
				[key]: target.value
			}
		})
	}

	render() {
		let form = this.state.form
		let { type } = this.props.login
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
		};

		return (
			<div className={styles.login_page}>
				<p className={styles.login_title}>
					{
						type === 1 ? 'Login' : 'Register'
					}
				</p>
				<div className={styles.login_form}>
					<Form>
						<Form.Item className={styles.resetMB} {...formItemLayout} label={"用户名"}>
							<Input name="username" placeholder="请输入用户名" onChange={this.handleInput}/>
						</Form.Item>
						<Form.Item className={styles.resetMB} {...formItemLayout} label={"密码"}>
							<Input type="password" name="password" placeholder="请输入密码" onChange={this.handleInput} />
						</Form.Item>
						{
							type === 1 ? '' : 
							<Form.Item className={styles.resetMB} {...formItemLayout} label={"确认密码"}>
								<Input type="password" placeholder="确认密码" />
							</Form.Item>
						}
						<Form.Item className={styles.resetMB} {...formItemLayout} label={"验证码"}>
							<Input style={{ width: '60%' }} placeholder="请输入验证码" />
							<span onClick={this.getVerifyCode} className={styles.code} style={{ width: '30%' }}>{this.state.code}</span>
						</Form.Item>
						<Form.Item>
							<Button onClick={this.resetForm.bind(this)}>
								重置
							</Button>
							<Button style={{marginLeft:70, backgroundColor: '#49b1f5',color: '#fff'}} onClick={this.subForm.bind(this)} >
								{
									type === 1 ? '登录' : '注册'
								}
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		);
	}
}

LoginPage.propTypes = {
};

// export default connect(
//     ({ login }) => ({
//         type: login.type
//     })
// )(LoginPage);
export default connect()(LoginPage)