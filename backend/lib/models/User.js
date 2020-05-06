/*
 * @ Author: Fairy
 * @ Description: 用户表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:38:53
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  }, // 账号
  nickname: String, // 昵称
  password: String, // 密码
  createdAt: { // 创建时间
    type: Date,
    default: Date.now
  },
  updatedAt: { // 更新时间
    type: Date,
    default: Date.now
  },
  loginTime: { // 登录时间
    type: Date,
    default: null,
  },
  avatar: { // 用户头像
    type: String,
    default: null,
  },
});

UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.set('toObject', { getters: true, virtuals: true });

UserSchema.path('createdAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

UserSchema.path('updatedAt').get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

var User = mongoose.model("User", UserSchema);

module.exports = User;