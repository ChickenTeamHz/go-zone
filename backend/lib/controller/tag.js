const {
  TagService,
} = require('~service');

const ApiError = require('~ApiError');
const { verify } = require('~utils/validate');
const { verifyToken } = require('~utils/util');
const _ = require('lodash');

module.exports = {
  /**
   * 获取标签列表
   * @param {*} ctx 
   */
  async getList (ctx) {
    try {
      const res = await TagService.find();
      const tags = res.map(item => { 
        return {
          title: item.title, 
          id: item.id
        }
      })
      ctx.body = tags;
    }catch(err) {
      throw err;
    }
 },
}

