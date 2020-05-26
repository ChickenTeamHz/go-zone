/*
 * @Author: Fairy
 * @Description: 图片表
 * @Last Modified by: Fairy
 * @Last Modified time: 2020-05-25 18:54:52
*/
const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const qs = require('~utils/upload');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  album: { // 相册类别id
    type: String,
    ref: 'Album',
  },
  createdAt: { // 创建时间
    type: Date,
    default: Date.now,
  },
  imgPath: String, // 图片地址
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

PhotoSchema.virtual('imgPathUrl').get(function () {
  return this.imgPath ? qs.config.origin + this.imgPath : null;
});

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;