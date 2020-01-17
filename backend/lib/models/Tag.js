/*
 * @ Author: Fairy
 * @ Description: 博客标签表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:43:39
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  title: String // 标签名称
});

TagSchema.set('toJSON', { getters: true, virtuals: true });
TagSchema.set('toObject', { getters: true, virtuals: true });

var Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;