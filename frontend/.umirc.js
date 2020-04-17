
// ref: https://umijs.org/config/
import { resolve } from "path";

export default {
  treeShaking: true,
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: '../pages/User/Login',
        },
        // {
        //   name: 'register',
        //   path: '/user/register',
        //   component: './pages/User/register',
        // },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/', component: '../pages/index' },
        { path: '/home', component: '../pages/Home'}
      ]
    }
  ],

  alias: {
    '@': resolve(__dirname, './src'),
    "assets": resolve(__dirname,"./src/assets"),
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'go Zone',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
      links: [
        { rel: 'stylesheet', href: '/styles/animate.min.css'},
      ]
    }],
  ],
  theme: {
    '@primary-color': '#333',
  },
}
