const {
  ArticleCommentService,
  ArticleService,
} = require('~service');

const ApiError = require('~ApiError');
const shortid = require('shortid')
const { verifyToken } = require('~utils/util');
const _ = require("lodash");
const ArticleComment = require('~models/ArticleComment');

module.exports = {
  /**
   * 获取评论信息
   * @param {*} ctx 
   */
  async getList (ctx) {
    try {
      const { articleId } = ctx.query;
      const parentRes = await ArticleCommentService.find({}, {
        query: {
          article: articleId,
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
        const childRes = await ArticleCommentService.find({}, {
          query: {
            parentId: item.id,
            article: articleId,
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
        articleId,
        content = null,
        parentId = null,
        replyId = null,
        root = 0,
      } = ctx.request.body;
      if(!articleId || !shortid.isValid(articleId)) {
        ctx.throw(400,'参数异常');
      }
      await ArticleCommentService.create({
        article: articleId,
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
    const {
      articleId,
    } = ctx.request.body;
    const { id: userId } = verifyToken(ctx);
    const articleRes = await ArticleService.findOne(ctx,{
      query: {
        _id: articleId
      }
    });
    const commentRes = await ArticleCommentService.findOne(ctx,{
      query: {
        _id: commentId
      }
    });
    if(_.isEmpty(articleRes) || _.isEmpty(commentRes)) {
      ctx.throw(400,'参数异常');
    }
    if(userId !== commentRes.user && userId !== articleRes.user) {
      throw new ApiError(null, {
        code: 100000,
        message: '没有权限删除该条评论！'
      })
    }
    const childRes = await ArticleCommentService.find({},{
      query: {
        parentId: commentId,
      }
    });
    const ids = childRes.map(item => item.id)
    ids.push(commentId)
    const res = await ArticleCommentService.removes(ctx, ids)
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

