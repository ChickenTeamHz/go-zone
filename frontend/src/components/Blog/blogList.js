import React, { Component } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

class BlogList extends Component {
    constructor(props) {
        super(props)
        this.state = {
          blogList: [{
            title: '1.前端大牛是如何产生的',
            content: '第三节疯狂老师九分裤矢量发动机疯狂司法解释龙口粉丝加分副驾驶的快乐番薯杰弗里斯看得见风第三节疯狂老师九分裤矢量发动机疯狂司法解释龙口粉丝加分副驾驶的快乐番薯杰弗里斯看得见风'
          },
          {
            title: '2.前端大牛是如何产生的',
            content: '第三节疯狂老师九分裤矢量发动机疯狂司法解释龙口粉丝加分副驾驶的快乐番薯杰弗里斯看得见风第三节疯狂老师九分裤矢量发动机疯狂司法解释龙口粉丝加分副驾驶的快乐番薯杰弗里斯看得见风'
          },
          {
            title: '2.前端大牛是如何产生的',
            content: '第三节疯狂老师九分裤矢量发动机疯狂司法解释龙口粉丝加分副驾驶的快乐番薯杰弗里斯看得见风第三节疯狂老师九分裤矢量发动机疯狂司法解释龙口粉丝加分副驾驶的快乐番薯杰弗里斯看得见风'
          }]
        }
    }
    
    render() {
        return (
          <div className="blog-list">
            {
              this.state.blogList.map(val => {
                return (
                  <div className='blog-item'>
                    <div className="title_blog">{val.title}</div>
                    <div className="intro">
                      {val.content}
                    </div>
                    <div className="tool-bar">
                      <div className="icon-box">
                        <i></i>
                        访问量:10
                      </div>
                      <div className="icon-box">
                        <i></i>
                        点赞量:10
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        );
    }
}

  
export default connect()(BlogList);