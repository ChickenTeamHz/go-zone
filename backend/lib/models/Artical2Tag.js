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

const Artical2TagSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  artical: { // 用户id
    type: String,
    ref: 'Artical',
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

Artical2TagSchema.set('toJSON', { getters: true, virtuals: true });
Artical2TagSchema.set('toObject', { getters: true, virtuals: true });
Artical2TagSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const Artical2Tag = mongoose.model("Artical2Tag", Artical2TagSchema);

module.exports = Artical2Tag;