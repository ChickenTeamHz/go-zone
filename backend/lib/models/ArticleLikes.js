/*
 * @ Author: Fairy
 * @ Description: 文章点赞表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:56:53
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const Schema = mongoose.Schema;

const ArticleLikesSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  user: { // 点赞用户id
    type: String,
    ref: 'User',
  },
  article: { // 文章id
    type: String,
    ref: 'Article',
  },
  liked: { // 是否点赞
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ArticleLikesSchema.set('toJSON', { getters: true, virtuals: true });
ArticleLikesSchema.set('toObject', { getters: true, virtuals: true });
ArticleLikesSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const ArticleLikes = mongoose.model("ArticleLikes", ArticleLikesSchema);

module.exports = ArticleLikes;