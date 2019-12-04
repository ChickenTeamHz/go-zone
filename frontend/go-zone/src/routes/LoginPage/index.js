import React, { Component } from 'react';
import { connect } from 'dva'
import styles from './index.css'

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginType: ''
        }
    }
    componentDidMount() {
        this.setState({
            loginType: Number(this.props.location.query.type)
        })
    }
    
    render() {
        return (
            <div className={ styles.login_page }>
                <p className={ styles.login_title }>
                    {
                        this.state.loginType === 1 ?  'Login': 'Register'
                    }
                </p>
                <div className={styles.login_form}>
    
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
};

export default connect()(LoginPage);