/*
 * @ Author: Fairy
 * @ Description: 文章标签关联表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 19:21:40
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const Schema = mongoose.Schema;

const Article2TagSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  article: { // 用户id
    type: String,
    ref: 'Article',
  },
  tag: {
    type: String,
    ref: 'Tag',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Article2TagSchema.set('toJSON', { getters: true, virtuals: true });
Article2TagSchema.set('toObject', { getters: true, virtuals: true });
Article2TagSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const Article2Tag = mongoose.model("Article2Tag", Article2TagSchema);

module.exports = Article2Tag;