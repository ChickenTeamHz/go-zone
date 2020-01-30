// import dynamic from 'dva/dynamic';

// import {Switch, Route, routerRedux } from 'dva/router';
// import MainLayout from './layouts/MainLayout'

// const { ConnectedRouter } = routerRedux


// function RouterConfig({ history, app }) {
//   const routes = [
//     {
//       path: "/",
//       name: 'IndexPage',
//       layout: MainLayout,
//       // models: () => [import('./models/example')],
//       component: () => import('./views/IndexPage')
//     },
//     {
//       path: "/login",
//       name: 'LoginPage',
//       layout: MainLayout,
//       // models: () => [import('./models/login')],
//       component: () => import('./views/LoginPage/index')
//     }
//   ];

//   return(
//     <ConnectedRouter history={history}>
//         <Switch>
//             {
//               routes.map(({ path, name, layout, ...dynamics }, key) => {
//                 let Component = dynamic({ app, ...dynamics })
//                 return (
//                   <Route 
//                     path={path} 
//                     key={key} 
//                     exact 
//                     render={(props) => {
//                       if (layout) {
//                         return (<MainLayout>
//                           <Component {...props}/>
//                         </MainLayout>)
//                       }
//                       return (<Component {...props}/>)
//                     }}/>
//                 )
//               })
//             }
//         </Switch>
//     </ConnectedRouter>
//   )
// }


// export default RouterConfig

import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { RouterToUrlQuery } from 'react-url-query';
import { getRouterData } from './common/router';
// import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';

const { ConnectedRouter } = routerRedux;
// const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const BasicLayout = routerData['/'].component;
  return (
    <ConnectedRouter history={history}>
      <RouterToUrlQuery>
        <Switch>
          <Route
            render={props => <BasicLayout {...props} />} />
        </Switch>
      </RouterToUrlQuery>
    </ConnectedRouter>
  );
}

export default RouterConfig;
