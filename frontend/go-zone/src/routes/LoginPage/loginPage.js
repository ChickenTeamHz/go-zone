import React from 'react'
import { connect } from 'dva'
import styles from './loginPage.css'

function LoginPage() {
    return (
        <div className={ styles.login_page }>hello!</div>
    );
}

LoginPage.propTypes = {
};

export default connect()(LoginPage);