/*
 * @ Author: Fairy
 * @ Description: 文章表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:41:26
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment')
const Schema = mongoose.Schema;

const ArticalSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  user: { // 用户id
    type: String,
    ref: 'User',
  },
  articalCategory: { // 类别id
    type: String,
    ref: 'ArticalCategory',
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
  public: { // 是否公开
    type: Boolean,
    default: true,
  },
});

ArticalSchema.set('toJSON', { getters: true, virtuals: true });
ArticalSchema.set('toObject', { getters: true, virtuals: true });

ArticalSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

ArticalSchema.path('updatedAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});


const Artical = mongoose.model("Artical", ArticalSchema);

module.exports = Artical;