const {
  ArticalCategoryService,
} = require('~service');

const ApiError = require('~ApiError');
const { verifyToken } = require('~utils/util');

module.exports = {
  /**
   * 获取日志信息
   * @param {*} ctx 
   */
  async getList (ctx) {
    try {
      const { id: userId } = verifyToken(ctx);
      const res = await ArticalCategoryService.find({},{
        query: {
          user: userId,
        },
        filters: '-user',
      });
      ctx.body = res;
    }catch(err) {
      throw err;
    }
 },
}

