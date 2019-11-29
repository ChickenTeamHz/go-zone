import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import LoginPage from './routes/LoginPage';
import HeaderBar from './components/HeadBar'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <div className="wrapper">
        <HeaderBar></HeaderBar>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={LoginPage} />
      </div>
    </Router>
  );
}

export default RouterConfig;
