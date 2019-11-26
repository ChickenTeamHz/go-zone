const Koa = require('koa')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const router = require('./routes');
 
const app = new Koa()
 
// 处理跨域的配置
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));
 
 
const db = mongoose.connect("mongodb://localhost/testDB")
 
var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String
});
 
var User = mongoose.model('User',UserSchema);

// 解析post请求
app.use(bodyParser())
 
router(app);
 
app.listen(3000,() => {
  console.log('app started at port 3000...')
});