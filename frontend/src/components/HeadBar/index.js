import React, { Component } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import styles from './index.scss'

class HeadBar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    toLogin(type) {
        
        console.log(this)
        
        this.props.dispatch({
            type: 'login/changeState',
            payload: {
                type: type
            }
        });

        // this.props.dispatch({
        //     type: 'login/toLoginPage'
        // });
        
        this.props.dispatch(routerRedux.push('/login'))
        
    }

    toPath = (path) => {
        console.log(path)
        this.props.dispatch(routerRedux.push(path))
    }

    toHome = () => {
        this.props.dispatch(routerRedux.push('/'))
    }
    render() {
        return (
            <div className={ styles.head_bar }>
                <div className={ styles.page_name } onClick={ this.toHome }>Go-Zone</div>
                <div className={ styles.head_right }>
                    <div className={ styles.login_btn } onClick={ this.toPath.bind(this,'/blog') }>Blog</div>
                    <div className={ styles.login_btn } onClick={ this.toPath.bind(this, '/login') }>Login</div>
                    <div className={ styles.login_btn } onClick={ this.toPath.bind(this, '/register')}>Register</div>
                </div>
            </div>
        );
    }
}

HeadBar.propTypes = {
};
  
export default connect()(HeadBar);