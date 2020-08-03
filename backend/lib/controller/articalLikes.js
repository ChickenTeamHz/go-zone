const {
  ArticalLikesService,
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
      const { liked, articalId } = ctx.request.body;
      const { id: userId } = verifyToken(ctx);
      const res = await ArticalLikesService.findOne(ctx,{
        query: {
          user: userId,
          artical: articalId,
        },
      });
      if(_.isEmpty(res)) {
        await ArticalLikesService.create({
          user: userId,
          artical: articalId,
          liked,
        })
      }else {
        await ArticalLikesService.update(ctx, res.id, {
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
    const { articalId } = ctx.query;
    const { id: userId } = verifyToken(ctx);
    const res = await ArticalLikesService.findOne(ctx,{
      query: {
        user: userId,
        artical: articalId,
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

