import React from 'react'
import { connect } from 'dva'
import styles from './loginPage.css'

function LoginPage() {
    return (
        <div className={ styles.login_page }>
            <p className={ styles.login_title }>Login</p>
            <div className={styles.login_form}>

            </div>
        </div>
    );
}

LoginPage.propTypes = {
};

export default connect()(LoginPage);