const {
  UserController,
} = require('~controller');

const apiRoute = (router) => {
  router.get('/',(ctx, next)=>{
    ctx.body={}
  });
  router.post('/user/login',UserController.login);
  router.post('/user/register',UserController.register);
  router.post('/user/reset',UserController.resetPassword);
  router.get('/user/profile',UserController.getOne);
}
module.exports = apiRoute;