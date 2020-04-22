/*
 * @ Author: Fairy
 * @ Description: 文章评论表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:49:51
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
const Schema = mongoose.Schema;

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
  parentId: { // 父评论id
    type: String,
    default: '',
  },
});

ArticalCommentSchema.set('toJSON', { getters: true, virtuals: true });
ArticalCommentSchema.set('toObject', { getters: true, virtuals: true });

var ArticalComment = mongoose.model("ArticalComment", ArticalCommentSchema);

module.exports = ArticalComment;