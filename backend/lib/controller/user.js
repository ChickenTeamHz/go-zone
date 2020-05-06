const {
  UserService
} = require('~service');

const ApiError = require('~ApiError');
const { verify, verifyPasswrod } = require('~utils/validate');
const { encrypt, randomPass, verifyToken } = require('~utils/util');
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
      const newPassword = encrypt(password);
      const user = await UserService.find(ctx,{
        query: {
          username,
        },
        filters: 'password',
      });
      if(_.isEmpty(user)) {
        throw new ApiError('ACCOUNT_NOT_EXIST');
      }
      if(user.password !== newPassword) {
        throw new ApiError('BAD_CREDENTIALS');
      }
      await UserService.update(ctx,user._id, {
        loginTime: Date.now(),
      })
      const token = sign({id: user._id, username }, jwtSecret, {expiresIn: jwtTime });
      ctx.body = {
        token,
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
          message: '两次输入的密码不一致！',
          name: 'INVALID_PARAM',
        });
      }
      const newPassword = encrypt(password);
      const res = await UserService.find(ctx,{
        query: {
        username,
      }});
      if(!_.isEmpty(res)){
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
  },

  /**
   * 重置密码
   * @param {*} ctx 
   */
  async resetPassword (ctx) {
     try {
       const {
         username,
         nickname,
       } = ctx.request.body;
       const res = await UserService.find(ctx,{
        query: {
        username,
        nickname,
       }});
       console.log(res);
       if(_.isEmpty(res)){
         throw new ApiError('ACCOUNT_NOT_EXIST');
       }
       const password = randomPass();
       await UserService.update(ctx, res._id, {
         password: encrypt(password),
       });
       ctx.body = {
         password,
       }

     }catch(err) {
       throw err;
     }
  },

  /**
   * 获取用户信息
   * @param {*} ctx 
   */
  async getOne (ctx) {
    try {
      const { id } = verifyToken(ctx);
      const res = await UserService.find(ctx,{
       query: {
        _id: id,
        },
      });
      ctx.body = res
    }catch(err) {
      throw err;
    }
 }
}

