
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
  }
}
