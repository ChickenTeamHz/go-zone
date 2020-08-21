const {
  UserController,
  UploadController,
  AlbumController,
  PhotoController,
  ArticleController,
  TagController,
  ArticleCategoryController,
  ArticleLikesController,
  ArticleCommentController,
} = require('~controller');
const ArticleComment = require('~models/ArticleComment');

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
  router.post('/articles',ArticleController.create);
  router.post('/articles/:articleId/draft',ArticleController.save);
  router.get('/tags',TagController.getList);
  router.get('/categorys',ArticleCategoryController.getList);
  router.get('/articles',ArticleController.getList);
  router.get('/articles/:articleId',ArticleController.getOne);
  router.post('/articles-likes',ArticleLikesController.LikeOne);
  router.get('/articles-likes',ArticleLikesController.isLike);
  router.post('/articles-comments',ArticleCommentController.comment);
  router.get('/articles-comments',ArticleCommentController.getList);
  router.delete('/article-comments/:commentId',ArticleCommentController.removes)
  router.delete('/articles/:articleId',ArticleController.removeOne);
  router.get('/search/articles',ArticleController.searchList);
}
module.exports = apiRoute;