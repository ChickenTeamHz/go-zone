/*
 * @Author: Fairy
 * @Description: 相册表
 * @Last Modified by:  Fairy
 * @Last Modified time: 2020-01-13 18:38:34
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment')
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  user: { // 用户id
    type: String,
    ref: 'User',
  },
  photoCategory: { // 相册类别id
    type: String,
    ref: 'PhotoCotegory',
  },
  createdAt: { // 创建时间
    type: Date,
    default: Date.now,
  },
  imgKey: String, // 图片地址
  deleted: { // 是否删除
    type: Boolean,
    default: false,
  },
});

PhotoSchema.set('toJSON', { getters: true, virtuals: true });
PhotoSchema.set('toObject', { getters: true, virtuals: true });
PhotoSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

var Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;