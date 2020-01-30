import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './login.scss'
import { Form, Button, Input } from 'antd'

const passWordReg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,15}$/

@connect(({ login }) => ({ login }))

class LoginPage extends Component {
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

	subForm(e) {
		e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
				console.log('Received values of form: ', values);

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
    });
		
	}

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		
    if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		
		if (passWordReg.test(value)) {
			callback();
		} else {
			callback('密码格式必须包括字母、数字、符号至少两种（不包含中文、空格）！')
		}
    
	}
	
	compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致!');
    } else {
			if (passWordReg.test(value)) {
				callback();
			} else {
				callback('密码格式必须包括字母、数字、符号至少两种（不包含中文、空格）6~15位！')
			}
    }
	};
	
	checkUsername = (rule, value, callback) => {
		let reg = /^[a-zA-Z0-9]{4,15}$/

		if (reg.test(value)) {
			callback()
		} else {
			callback('用户名必须为4~16位字符或数字组合!');
		}
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

	checkCode = (rule, value, callback) => {
		let reg = /^[0-9]{4}$/

		if (reg.test(value) && value == this.state.code) {
			callback()
		} else {
			callback('请输入正确的验证码!');
		}
	}

	render() {
		let form = this.state.form
		let { type } = this.props.login
		const { getFieldDecorator } = this.props.form;

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
					<Form onSubmit={this.subForm.bind(this)}>
						<Form.Item className={styles.resetMB} {...formItemLayout} label={"用户名"}>
							{getFieldDecorator('username', {
								rules: [
									{ required: true, message: '请输入用户名!' },
									{
										validator: this.checkUsername,
									}
								],
							})(
								<Input name="username" placeholder="请输入用户名" onChange={this.handleInput}/>
							)}
						</Form.Item>
						<Form.Item className={styles.resetMB} {...formItemLayout} label={"密码"}>
							{getFieldDecorator('password', {
								rules: [
									{ required: true, message: '请输入密码!' },
									{
										validator: this.validateToNextPassword,
									},
								],
							})(
								<Input type="password" name="password" placeholder="请输入密码" onChange={this.handleInput} />
							)}
						</Form.Item>
						{
							type === 1 ? '' : 
							<Form.Item className={styles.resetMB} {...formItemLayout} label={"确认密码"}>
								{getFieldDecorator('confirmDirty', {
									rules: [
										{ required: !type, message: '请确认密码!' },
										{
										validator: this.compareToFirstPassword,
										}
									],
								})(
									<Input type="password" placeholder="确认密码" />
								)}
							</Form.Item>
						}
						<Form.Item required className={styles.resetMB} {...formItemLayout} label={"验证码"}>
							{getFieldDecorator('code', {
									rules: [
										{
											validator: this.checkCode,
										}
									],
							})(
								<Input type="number" style={{ width: '60%' }} placeholder="请输入验证码" />
							)}
							<span onClick={this.getVerifyCode} className={styles.code} style={{ width: '30%' }}>{this.state.code}</span>
						</Form.Item>
						<Form.Item>
							<Button onClick={this.resetForm.bind(this)}>
								重置
							</Button>
							<Button htmlType="submit" style={{marginLeft:70, backgroundColor: '#49b1f5',color: '#fff'}} >
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

const WrappedNormalLoginForm = Form.create()(LoginPage);
export default connect()(WrappedNormalLoginForm)