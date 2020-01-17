import HeaderBar from '../components/HeadBar'


const routes = [
  {
    path: "/",
    component: () => import('./IndexPage'),
    layout: HeaderBar,
    name: 'IndexPage'
  },
  {
    path: "/login",
    layout: HeaderBar,
    component: () => import('./LoginPage'),
    name: 'Login'
  }
];


export default routes