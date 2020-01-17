const {
  UserController,
} = require('~controller');

const apiRoute = (router) => {
  router.get('/',(ctx, next)=>{
    ctx.body={}
  });
  router.post('/user/login',UserController.login);
  router.post('/user/register',UserController.register);
}
module.exports = apiRoute;