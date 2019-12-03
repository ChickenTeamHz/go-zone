import React, { Component } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import styles from './index.css'

class HeadBar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    toLogin(type) {
        console.log(this.props)
        this.props.dispatch(routerRedux.push({
            pathname: `/login?ha=545`,
            query: {
                type: type
            }
        }))
    }
    render() {
        return (
            <div className={ styles.head_bar }>
                <div className={ styles.page_name }>Go-Zone</div>
                <div className={ styles.head_right }>
                    <div className={ styles.login_btn } onClick={ this.toLogin.bind(this, 1) }>Login</div>
                    <div className={ styles.login_btn } onClick={ this.toLogin.bind(this, 2) }>Register</div>
                </div>
            </div>
        );
    }
}

HeadBar.propTypes = {
};

export default connect()(HeadBar);