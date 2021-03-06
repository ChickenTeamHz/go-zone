const {
  AlbumService,
  PhotoService,
} = require('~service');

const ApiError = require('~ApiError');
const { verify } = require('~utils/validate');
const { verifyToken } = require('~utils/util');
const _ = require('lodash');

module.exports = {
  /**
   * 新建相册
   * @param {*} ctx 
   */
  async create (ctx) {
    try {
      const {
        name,
        coverPath,
      } = ctx.request.body; 
      const { id } = verifyToken(ctx);
      const errInfo = verify(ctx,'album',{ name, coverPath }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      await AlbumService.create({
        name,
        coverPath,
        user: id,
      });
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 查找相册列表
   * @param {*}} ctx 
   */
  async getList(ctx) {
    try {
      const { id } = verifyToken(ctx);
      const res = await AlbumService.find({},{
        query: { user: id },
        filters: '-user'
      });
      ctx.body = res;
    }catch(err) {
      throw err;
    }
  },

  /**
   * 删除某个相册
   * @param {*} ctx 
   */
  async removeOne(ctx) {
    try {
      const { id } = ctx.params;
      await PhotoService.removes(ctx,id,'album');
      const res = await AlbumService.removes(ctx,id);
      if(res.n === 0) {
        throw new ApiError(null, {
          code: 100000,
          message: '没有找到需要删除的记录！',
        });
      }
      if(res.deletedCount === 0) {
        throw new ApiError(null, {
          code: 100000,
          message: '删除记录失败！',
        });
      };
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 更新相册
   * @param {*} ctx 
   */
  async update (ctx) {
    try {
      const { id } = ctx.params;
      const {
        name,
        coverPath,
      } = ctx.request.body; 
      const errInfo = verify(ctx,'album',{ name, coverPath }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      const res = await AlbumService.update(ctx,id,
        { 
          name,
          coverPath,
        });
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },
}

