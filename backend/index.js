const Koa = require('koa')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const router = require('./routes');
const db = require('./db/connect');
const koaMessageParameter = require('koa-message-parameter');
const logUtil = require('./core/utils/logUtil');
const responseFormatter = require('./middleware/responseFormatter');
const { jwtSecret } = require('./db/config');
const koajwt = require('koa-jwt');

require('./core/global')

const app = new Koa()
// 解析post请求
app.use(koaBody({
  multipart: true,  // 允许上传多个文件
  strict: false,
}))

 
// 处理跨域的配置
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));
 
 
db.start();

// 异常处理
app.use(async (ctx,next) => {
  const start = new Date()
  var ms;
  try{
      await next();
      ms = new Date() - start;
      logUtil.logResponse(ctx, ms);
  }catch(err){
      ms = new Date() - start;
      //记录异常日志
      logUtil.logError(ctx, err, ms);
  }
});

/**
 * 格式化返回信息
 */
app.use(responseFormatter());

app.use(koaMessageParameter(app));

app.use(koajwt({
  secret: jwtSecret
}).unless({
  path:['/user/login','/user/register','/user/reset']
}));


// 继续触发error事件
app.on('error',() => {
  console.error('server error', err.message);
  console.error(err);
});

router(app);

app.listen(3000,() => {
  console.log('app started at port 3000...')
});