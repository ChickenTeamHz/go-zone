import React from 'react';
import { Route, Switch, routerRedux } from 'dva/router';
import RouteArr from './routes/routeConfig'
import dynamic from 'dva/dynamic'


import HeaderBar from './components/HeadBar'

const { ConnectedRouter } = routerRedux

function RouterConfig({ history, app }) {
  let routes = RouteArr

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <div>
          {
            routes.map(({ path, name, layout, ...dynamics }) => {
              const Component = dynamic({ app, ...dynamics })
              return (
                <Route path={path} key={name} exact
                  render={(props) => {
                    if(layout) {
                      return (
                        <div>
                          <HeaderBar/>
                          <Component {...props} />
                        </div>
                      )
                    }
                    return (<Component {...props} />)
                  }} />
              )
            })
          }
        </div>
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
