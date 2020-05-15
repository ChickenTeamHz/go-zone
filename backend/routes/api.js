const {
  UserController,
  UploadController,
} = require('~controller');

const apiRoute = (router) => {
  router.get('/',(ctx, next)=>{
    ctx.body={}
  });
  router.post('/user/login',UserController.login);
  router.post('/user/register',UserController.register);
  router.post('/user/reset',UserController.resetPassword);
  router.get('/user/profile',UserController.getOne);
  router.put('/user',UserController.updateUser);
  router.put('/user/password',UserController.updatePassword);
  router.post('/user/avatar',UserController.updateAvatar);
  router.post('/upload/file',UploadController.uploadFile);
  router.post('/upload/base64',UploadController.upLoadBase64File);
}
module.exports = apiRoute;