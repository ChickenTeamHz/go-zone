import React, { Component } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import BlogList from './blogList'

class BlogWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    
    render() {
        return (
            <div className='card blog-wrapper'>
              <div className="title_main">历史文章</div>
              <BlogList />
            </div>
        );
    }
}

  
export default connect()(BlogWrapper);