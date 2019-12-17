import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './index.scss'

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                userName: '',
                passWord: '',
                email: ''
            }
        }

        this.handleChange = this.handleChange.bind(this)
    }

    resetForm() {
        this.setState({ 
            form:{
                userName: '',
                passWord: '',
                email: ''
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

    }

    componentDidMount() {
        
    }
    
    render() {
        let form = this.state.form
        return (
            <div className={ styles.login_page }>
                <p className={ styles.login_title }>
                    {
                        this.props.type === 1 ?  'Login': 'Register'
                    }
                </p>
                <div className={styles.login_form}>
                    <p className={ styles.each_line }>
                        <span className={ styles.form_label }>Username:</span>
                        <input 
                            name="userName"
                            value={form.userName} 
                            className={ styles.form_input } 
                            onChange={this.handleChange}
                            type="text"/>
                    </p>
                    <p className={ styles.each_line }>
                        <span className={ styles.form_label }>Password:</span>
                        <input 
                            name="passWord"
                            value={form.passWord} 
                            className={ styles.form_input } 
                            onChange={this.handleChange}
                            type="text"/>
                    </p>
                    <p className={ styles.each_line }>
                        <span className={ styles.form_label }>Email:</span>
                        <input 
                            name="email"
                            value={form.email} 
                            className={ styles.form_input } 
                            onChange={this.handleChange}
                            type="text"/>
                    </p>
                    <p className={ styles.each_line }>
                        <div className={ styles.button} onClick={this.resetForm.bind(this)}>Reset</div>
                        <div className={ styles.button} onClick={this.subForm.bind(this)} >
                            {
                                this.props.type === 1 ?  'Login': 'Register'
                            }
                        </div>
                    </p>
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
};

export default connect(
    ({ login }) => ({
        type: login.type
    })
)(LoginPage);