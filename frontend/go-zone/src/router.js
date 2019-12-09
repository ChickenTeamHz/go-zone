import dynamic from 'dva/dynamic';

import { Router } from 'dva/router';
import HeaderBar from './components/HeadBar'

import IndexPage from './routes/IndexPage'

import IndexModel from './models/example'

export const newDynamic = (app,model,component) => {
    return dynamic({
        app,
        models:() => model,
        component
    })
}



function RouterConfig({ history, app }) {
  const routes = [
    {
      title: 'index',
      path: "/",
      layout: HeaderBar,
      name: 'IndexPage',
      ...newDynamic(app, IndexModel, IndexPage)
    }
  ];

  return <Router history={history} routes={routes} />;
}


export default RouterConfig