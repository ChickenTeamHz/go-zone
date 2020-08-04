/*
 * @ Author: Fairy
 * @ Description: 文章表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:41:26
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const qs = require('~utils/upload');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  user: { // 用户id
    type: String,
    ref: 'User',
  },
  articleCategory: { // 类别id
    type: String,
    ref: 'ArticleCategory',
  },
  title: String, // 标题
  content: String, // 内容
  createdAt: { // 创建时间
    type: Date,
    default: Date.now,
  },
  updatedAt: { // 更新时间
    type: Date,
    default: Date.now,
  },
  deleted: { // 是否删除
    type: Boolean,
    default: false,
  },
  reading: { // 阅读量
    type: Number,
    default: 0,
  },
  publish: { // 是否发布
    type: Boolean,
    default: false,
  },
  public: { // 是否公开
    type: Boolean,
    default: false,
  },
  coverPath: { // 封面照片
    type: String,
    default: null,
  },
});

ArticleSchema.set('toJSON', { getters: true, virtuals: true });
ArticleSchema.set('toObject', { getters: true, virtuals: true });

ArticleSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

ArticleSchema.path('updatedAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

ArticleSchema.virtual('coverPathUrl').get(function () {
  return this.coverPath ? qs.config.origin + this.coverPath : null;
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;