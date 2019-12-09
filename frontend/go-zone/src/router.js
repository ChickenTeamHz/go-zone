import dynamic from 'dva/dynamic';

import {Switch, Route, routerRedux, Redirect } from 'dva/router';


const { ConnectedRouter } = routerRedux


function RouterConfig({ history, app }) {
  const routes = [
    {
      path: "/",
      name: 'IndexPage',
      models: () => [import('./models/example')],
      component: () => import('./routes/IndexPage')
    },
    {
      path: "/login",
      name: 'LoginPage',
      models: () => [import('./models/example')],
      component: () => import('./routes/LoginPage/index')
    }
  ];

  return(
    <ConnectedRouter history={history}>
      <Switch>
          {
            routes.map(({ path, name, ...dynamics }, key) => {
              return (
                <Route 
                  path={path} 
                  key={key} 
                  exact 
                  component={dynamic({ app, ...dynamics })}/>
              )
            })
          }
      </Switch>
    </ConnectedRouter>
  )
}


export default RouterConfig