const {
  PhotoService,
  AlbumService,
} = require('~service');

const ApiError = require('~ApiError');
const _ = require('lodash');

module.exports = {
  /**
   * 上传照片
   * @param {*} ctx 
   */
  async create (ctx) {
    try {
      const {
        imgKeys
      } = ctx.request.body; 
      const { id } = ctx.params;
      const res = await AlbumService.findOne(ctx, {
        query: {
          _id: id,
        },
        filters: '-user'
      });
      if(_.isEmpty(res)) {
        throw new ApiError(null,{
          code: '100000',
          message: '相册不存在！',
        })
      };
      const data = imgKeys.map(item => {
        return {
          album: id,
          imgPath: item,
        }
      })
      await PhotoService.create(data);
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 获取相册信息
   * @param {*}} ctx 
   */
  async getList(ctx) {
    try {
      const { id } = ctx.params;
      const album = await AlbumService.findOne(ctx,{
        query: { _id: id },
        filters: '-user'
      });
      
      if(_.isEmpty(album)) {
        throw new ApiError(null,{
          code: 100000,
          message: '相册不存在！',
        })
      }

      const photoList = await PhotoService.find({},{
        query: { album: id, deleted: false },
        filters: '-deleted',
      });

      ctx.body = {
        photoList,
        album,
      };
    }catch(err) {
      throw err;
    }
  },

  /**
   * 删除照片
   * @param {*} ctx 
   */
  async remove(ctx) {
    try {
      const {
        imgIds
      } = ctx.request.body; 
      const res = await PhotoService.safeDelete(ctx,imgIds);
      if(res.n < imgIds.length) {
        throw new ApiError(null,{
          code: 100000,
          message: '没有匹配到相关记录！',
        })
      }
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 更新相册
   * @param {*} ctx 
   */
  async updateMany (ctx) {
    try {
      const {
        toAlbumId,
        imgIds,
      } = ctx.request.body; 
      const { id } = ctx.params;
      if(id === toAlbumId) {
        throw new ApiError(null,{
          code: '100000',
          message: '移动的相册必须是其他相册！'
        })
      }
      const album = await AlbumService.findOne(ctx, {
        query: {
          _id: toAlbumId,
        },
        filters: '-user'
      });
      if(_.isEmpty(album)) {
        throw new ApiError(null,{
          code: '100000',
          message: '相册不存在！',
        })
      };
      const res = await PhotoService.updateMany(ctx,imgIds,
        { 
          album: toAlbumId,
        });
      if(res.n < imgIds.length) {
        throw new ApiError(null,{
          code: 100000,
          message: '没有匹配到相关记录！',
        })
      }
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },
}

