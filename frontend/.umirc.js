
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
        {
          name: 'register',
          path: '/user/register',
          component: '../pages/User/Register',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            { path: '/home', component: '../pages/Home' },
            {
              path: '/blog',
              routes: [{
                path: '/blog',
                redirect: '/blog/create',
              },{
                path: '/blog/create',
                component: '../pages/Blog/Create',
              },{
                path: '/blog/detail/:articleId',
                component: '../pages/Blog/Detail',
              },{
                path: '/blog/edit/:articleId',
                component: '../pages/Blog/Edit',
              },{
                path: '/blog/posts',
                component: '../pages/Blog/MyColumn',
              },{
                path: '/blog/likes',
                component: '../pages/Blog/Likes',
              },{
                path: '/blog/draft',
                component: '../pages/Blog/Draft',
              },{
                path: '/blog/search',
                component: '../pages/Blog/Search',
              }]
            },
            {
              path: '/album',
              routes: [{
                path: '/album',
                redirect: '/album/home',
              },
              {
                path: '/album/home',
                component: '../pages/Album',
              },
              {
                path: '/album/:albumId/photos',
                component: '../pages/Album/Photos',
              },
            ]
            },
            { path: '/profile', component: '../pages/Profile' },
            {
              component: '../pages/404',
            }
          ]
        },
        {
          component: '../pages/404',
        }
      ]
    },
  ],

  alias: {
    '@': resolve(__dirname, './src'),
    "assets": resolve(__dirname,"./src/assets"),
    "utils": resolve(__dirname,"./src/utils"),
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
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  chainWebpack(config) {
    config.module
      .rule('eslint')
        .use('eslint-loader')
        .tap(options => ({
          ...options,
          baseConfig: {
            extends: [require.resolve('@umijs/fabric/dist/eslint')],
          },
          ignore: false,
          eslintPath: require.resolve('eslint'),
          useEslintrc: true,
        }))
  },
}
