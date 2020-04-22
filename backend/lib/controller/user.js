const {
  UserService
} = require('~service');

const ApiError = require('~ApiError');
const { verify, verifyPasswrod } = require('~utils/validate');
const { encrypt } = require('~utils/util');
const xss = require("xss");
const _ = require('lodash');
const { sign } = require('jsonwebtoken');
const { jwtSecret, jwtTime } = require('../../db/config');

module.exports = {
  /**
   * 用户登录
   * @param {*} ctx 
   */
  async login (ctx) {
    try {
      const {
        username,
        password,
      } = ctx.request.body;
      const errInfo = verify(ctx,'register',{ username, password }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      if(!verifyPasswrod(password)) {
        throw new ApiError(null,{
          code: 100000,
          message: '密码格式错误！',
          name: 'INVALID_PARAM',
        });
      }
      const newPassword = encrypt(password);
      const user = await UserService.find(ctx,{
        query: {
          username,
          password: newPassword,
        },
        files:'-password -loginTime',
      });
      if(_.isEmpty(user)) {
        throw new ApiError('ACCOUNT_NOT_EXIST');
      } 
      await UserService.update(ctx,user._id, {
        loginTime: Date.now(),
      })
      const token = sign({id: user._id, username }, jwtSecret, {expiresIn: jwtTime });
      ctx.body = {
        token,
        user,
      };
    }catch(err) {
      throw err;
    }
  },

  /**
   * 用户注册
   * @param {*} ctx 
   */
  async register (ctx) {
    try {
      const {
        username,
        password,
        confirmPassword,
        nickname,
      } = ctx.request.body; 
      const errInfo = verify(ctx,'register',{ username, password, nickname }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      if(!verifyPasswrod(password)) {
        throw new ApiError(null,{
          code: 100000,
          message: '密码格式错误！',
          name: 'INVALID_PARAM',
        });
      }
      if(confirmPassword !== password){
        throw new ApiError(null,{
          code: 100000,
          message: '输入的两次密码不一致！',
          name: 'INVALID_PARAM',
        });
      }
      const newPassword = encrypt(password);
      const res = await UserService.find(ctx,{
        query: {
        username,
      }});
      if(res){
        throw new ApiError(null,{ message: '账号已存在！', code: 409 });
      }
      await UserService.create({
        username,
        password:newPassword,
        nickname,
      });
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  }
}

