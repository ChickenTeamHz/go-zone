const {
  UserController,
  UploadController,
  AlbumController,
  PhotoController,
  ArticalController,
  TagController,
  ArticalCategoryController,
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
  router.post('/albums',AlbumController.create);
  router.get('/albums',AlbumController.getList);
  router.delete('/albums/:id',AlbumController.removeOne);
  router.put('/albums/:id',AlbumController.update);
  router.post('/albums/:id/photos',PhotoController.create);
  router.get('/albums/:id/photos',PhotoController.getList);
  router.delete('/albums/:id/photos',PhotoController.remove);
  router.put('/albums/:id/photos',PhotoController.updateMany);
  router.post('/articals',ArticalController.create);
  router.post('/articals/:id/draft',ArticalController.save);
  router.get('/tags',TagController.getList);
  router.get('/categorys',ArticalCategoryController.getList);
}
module.exports = apiRoute;