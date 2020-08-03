const {
  ArticalCommentService,
} = require('~service');

const ApiError = require('~ApiError');
const shortid = require('shortid')
const { verifyToken } = require('~utils/util');
const _ = require("lodash");
const ArticalComment = require('~models/ArticalComment');

module.exports = {
  /**
   * 获取评论信息
   * @param {*} ctx 
   */
  async getList (ctx) {
    try {
      const { articalId } = ctx.query;
      const parentRes = await ArticalCommentService.find({}, {
        query: {
          artical: articalId,
          parentId: null,
        },
        populate: ['user'],
        sort: {
          createdAt: -1,
        }
      })
      if(_.isEmpty(parentRes)) {
        ctx.body = []
      }
      let list = []
      for(let item of parentRes) { 
        const childRes = await ArticalCommentService.find({}, {
          query: {
            parentId: item.id,
            artical: articalId,
          },
          populate: ['user','replyUser'],
        })
        const children = childRes.map(child => {
          const { user = {}, replyUser = {}} = child
          return {
            id: child.id,
            nickname: user.nickname,
            avatar: user.avatar,
            userId: user.id,
            createdAt: child.createdAt,
            content: child.content,
            replyId: replyUser.id,
            replyName: replyUser.nickname,
            root: child.root,
          }
        })
        const { user = {}} = item
        list.push({
          id: item.id,
          nickname: user.nickname,
          avatar: user.avatar,
          userId: user.id,
          createdAt: item.createdAt,
          content: item.content,
          replyId: null,
          replyName: null,
          root: 0,
          children,
        })
      }
      ctx.body = list;
    }catch(err) {
      throw err;
    }
 },
  /**
   * 评论
   * @param {*} ctx 
   */
  async comment (ctx) {
    try {
      const { id: userId } = verifyToken(ctx);
      const {
        articalId,
        content = null,
        parentId = null,
        replyId = null,
        root = 0,
      } = ctx.request.body;
      if(!articalId || !shortid.isValid(articalId)) {
        ctx.throw(400,'参数异常');
      }
      await ArticalCommentService.create({
        artical: articalId,
        content,
        user: userId,
        parentId,
        replyUser: replyId,
        root,
      })
      ctx.body = {};
    }catch(err) {
      throw err;
    }
 },

 /**
  * 删除评论
  * @param {*} ctx 
  */
 async removes(ctx) {
   try {
    const { commentId } = ctx.params;
    const childRes = await ArticalCommentService.find({},{
      query: {
        parentId: commentId,
      }
    });
    const ids = childRes.map(item => item.id)
    ids.push(commentId)
    const res = await ArticalCommentService.removes(ctx, ids)
    if (res.deletedCount === 0) {
      throw new ApiError(null, {
        code: 100000,
        message: "删除失败！",
      });
    }
    ctx.body = {}
   }catch(err) {
     throw err;
   }
 }
}

