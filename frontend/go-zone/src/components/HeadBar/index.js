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
        
        console.log(this)
        this.props.dispatch(routerRedux.push({
            pathname: `/login`,
            query: {
                type: type
            }
        }))
        
        // this.props.dispatch({
        //     type: 'global/redirect'
        // });
    }
    routerWillLeave(nextLocation) {
        // 返回 false 会继续停留当前页面，
        // 否则，返回一个字符串，会显示给用户，让其自己决定
        if (true)
          return '确认要离开？';
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