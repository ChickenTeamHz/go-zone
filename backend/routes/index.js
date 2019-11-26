const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
module.exports = app => {
  app.use(router.routes()).use(router.allowedMethods)
}