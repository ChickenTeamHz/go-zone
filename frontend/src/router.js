import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { RouterToUrlQuery } from 'react-url-query';
import { getRouterData } from './common/router';
// import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';
// import Login from './routes/User/Login'

const { ConnectedRouter } = routerRedux;
// const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const BasicLayout = routerData['/'].component;

  const Login = routerData['/user/login'].component;
  const Register = routerData['/user/register'].component;
  const Blog = routerData['/blog/index'].component;

  return (
    <ConnectedRouter history={history}>
      <RouterToUrlQuery>
          <Switch>
            <BasicLayout>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/blog" component={Blog} />
            </BasicLayout>
          </Switch>
      </RouterToUrlQuery>
    </ConnectedRouter>
  );
}

export default RouterConfig;
