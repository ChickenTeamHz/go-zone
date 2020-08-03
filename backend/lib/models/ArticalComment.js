/*
 * @ Author: Fairy
 * @ Description: 文章评论表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:49:51
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const Schema = mongoose.Schema;
moment.locale("zh-cn")

const ArticalCommentSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  user: { // 用户id
    type: String,
    ref: 'User',
  },
  artical: { // 文章id
    type: String,
    ref: 'Artical',
  },
  content: String, // 评论内容
  parentId: { // 父评论Id
    type: String,
    default: null,
  },
  replyUser: { // 回复人
    type: String,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  root: {
    type: Number,
    default: 0,
  }
});

ArticalCommentSchema.set('toJSON', { getters: true, virtuals: true });
ArticalCommentSchema.set('toObject', { getters: true, virtuals: true });
ArticalCommentSchema.path('createdAt').get(function (v) {
  return moment(v).fromNow();
});


const ArticalComment = mongoose.model("ArticalComment", ArticalCommentSchema);

module.exports = ArticalComment;