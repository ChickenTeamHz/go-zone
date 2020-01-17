/*
 * @ Author: Fairy
 * @ Description: 文章点赞表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:56:53
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
const Schema = mongoose.Schema;

const ArticalLikesSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  user: { // 点赞用户id
    type: String,
    ref: 'User',
  },
  artical: { // 文章id
    type: String,
    ref: 'Artical',
  },
  liked: { // 是否点赞
    type: Boolean,
    default: false,
  },
});

ArticalLikesSchema.set('toJSON', { getters: true, virtuals: true });
ArticalLikesSchema.set('toObject', { getters: true, virtuals: true });

var ArticalLikes = mongoose.model("ArticalLikes", ArticalLikesSchema);

module.exports = ArticalLikes;