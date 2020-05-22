/*
 * @ Author: Fairy
 * @ Description: 相冊表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:41:26
*/

const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const Schema = mongoose.Schema;
const qs = require('~utils/upload');

const AlbumSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  name: String, // 相册名称
  user: { // 用户id
    type: String,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  coverPath: { // 用户头像
    type: String,
    default: null,
  },
});

AlbumSchema.set('toJSON', { getters: true, virtuals: true });
AlbumSchema.set('toObject', { getters: true, virtuals: true });

AlbumSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

AlbumSchema.virtual('coverPathUrl').get(function () {
  return this.coverPath ? qs.config.origin + this.coverPath : null;
});

const Album = mongoose.model("Album", AlbumSchema);

module.exports = Album;