/*
 * @ Author: Fairy
 * @ Description: 博客标签表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:43:39
*/
const mongoose = require('mongoose');
const moment = require('moment');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: String, // 标签名称
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TagSchema.set('toJSON', { getters: true, virtuals: true });
TagSchema.set('toObject', { getters: true, virtuals: true });
TagSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;