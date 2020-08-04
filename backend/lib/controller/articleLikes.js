const {
  ArticleLikesService,
} = require('~service');

const ApiError = require('~ApiError');
const { verifyToken } = require('~utils/util');
const _ = require("lodash");

module.exports = {
  /**
   * 点赞文章
   * @param {*} ctx 
   */
  async LikeOne (ctx) {
    try {
      const { liked, articleId } = ctx.request.body;
      const { id: userId } = verifyToken(ctx);
      const res = await ArticleLikesService.findOne(ctx,{
        query: {
          user: userId,
          article: articleId,
        },
      });
      if(_.isEmpty(res)) {
        await ArticleLikesService.create({
          user: userId,
          article: articleId,
          liked,
        })
      }else {
        await ArticleLikesService.update(ctx, res.id, {
          liked,
        })
      }
      ctx.body = {};
    }catch(err) {
      throw err;
    }
 },

 /**
  * 获取当前用户文章点赞状态
  * @param {*} ctx 
  */
 async isLike(ctx) {
  try {
    const { articleId } = ctx.query;
    const { id: userId } = verifyToken(ctx);
    const res = await ArticleLikesService.findOne(ctx,{
      query: {
        user: userId,
        article: articleId,
      },
    });
    const { liked = false } = res || {}
    ctx.body = {
      liked,
    }
  }catch(err) {
    throw err
  }
}
}

