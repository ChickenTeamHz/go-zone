const mongoose = require('mongoose');
var shortid = require('shortid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  username: String, // 账号
  name: String, // 昵称
  password: String, // 密码
  logindate: Date, // 登录时间
});

UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.set('toObject', { getters: true, virtuals: true });

var User = mongoose.model("User", UserSchema);

module.exports = User;