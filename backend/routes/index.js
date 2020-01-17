const router = require('koa-router')()
const apiRoute = require('./api') //引入路由

apiRoute(router); //应用路由

module.exports = app => {
  app.use(router.routes()).use(router.allowedMethods)
}