import dynamic from 'dva/dynamic';

import {Switch, Route, routerRedux } from 'dva/router';
import MainLayout from './layouts/MainLayout'

const { ConnectedRouter } = routerRedux


function RouterConfig({ history, app }) {
  const routes = [
    {
      path: "/",
      name: 'IndexPage',
      layout: MainLayout,
      // models: () => [import('./models/example')],
      component: () => import('./routes/IndexPage')
    },
    {
      path: "/login",
      name: 'LoginPage',
      layout: MainLayout,
      // models: () => [import('./models/login')],
      component: () => import('./routes/LoginPage/index')
    }
  ];

  return(
    <ConnectedRouter history={history}>
      {/* <App> */}
        <Switch>
            {
              routes.map(({ path, name, layout, ...dynamics }, key) => {
                let Component = dynamic({ app, ...dynamics })
                return (
                  <Route 
                    path={path} 
                    key={key} 
                    exact 
                    render={(props) => {
                      if (layout) {
                        return (<MainLayout>
                          <Component {...props}/>
                        </MainLayout>)
                      }
                      return (<Component {...props}/>)
                    }}/>
                )
              })
            }
        </Switch>
      {/* </App> */}
    </ConnectedRouter>
  )
}


export default RouterConfig