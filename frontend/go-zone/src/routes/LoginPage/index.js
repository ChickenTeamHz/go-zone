import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './index.scss'

@connect(({ login }) => ({ login }))

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                username: 'go',
                password: '123456',
            }
        }

        this.handleChange = this.handleChange.bind(this)
    }

    resetForm() {
        this.setState({ 
            form:{
                userName: '',
                passWord: ''
            }
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            form: { 
                [name]: value
            }
        })
    }

    subForm() {
        this.props.dispatch({
            type: 'login/login',
            payload: this.state.form
        }).then(res => {

        })
    }

    componentDidMount() {
        console.log(this.props)
    }
    
    render() {
        let form = this.state.form
        let { type } = this.props.login
        return (
            <div className={ styles.login_page }>
                <p className={ styles.login_title }>
                    {
                        type === 1 ?  'Login': 'Register'
                    }
                </p>
                <div className={styles.login_form}>
                    <div className={ styles.each_line }>
                        <span className={ styles.form_label }>Username:</span>
                        <input 
                            name="username"
                            value={form.username} 
                            className={ styles.form_input } 
                            onChange={this.handleChange}
                            type="text"/>
                    </div>
                    <div className={ styles.each_line }>
                        <span className={ styles.form_label }>Password:</span>
                        <input 
                            name="password"
                            value={form.password} 
                            className={ styles.form_input } 
                            onChange={this.handleChange}
                            type="text"/>
                    </div>
                    <div className={ styles.each_line }>
                        <span className={ styles.form_label }>code:</span>
                        <input 
                            name="email"
                            value={form.email} 
                            className={ styles.form_input } 
                            onChange={this.handleChange}
                            type="text"/>
                        {/* <span>dfs</span> */}
                    </div>
                    <div className={ styles.each_line }>
                        <div className={ styles.button} onClick={this.resetForm.bind(this)}>Reset</div>
                        <div className={ styles.button} onClick={this.subForm.bind(this)} >
                            {
                                type === 1 ?  'Login': 'Register'
                            }
                        </div>
                    </div>
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