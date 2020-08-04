/*
 * @ Author: Fairy
 * @ Description: 文章类别表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:47:22
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const Schema = mongoose.Schema;

const ArticleCategorySchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: String, // 类别名称
  user: { // 用户id
    type: String,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ArticleCategorySchema.set('toJSON', { getters: true, virtuals: true });
ArticleCategorySchema.set('toObject', { getters: true, virtuals: true });
ArticleCategorySchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});


const ArticleCategory = mongoose.model("ArticleCategory", ArticleCategorySchema);

module.exports = ArticleCategory;