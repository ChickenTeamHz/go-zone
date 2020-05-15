const {
  UserService
} = require('~service');

const ApiError = require('~ApiError');
const { verify, verifyPasswrod } = require('~utils/validate');
const { encrypt, randomPass, verifyToken, formatBase64File } = require('~utils/util');
const xss = require("xss");
const _ = require('lodash');
const { sign } = require('jsonwebtoken');
const qn = require('~utils/upload');
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
 },

/**
 * 更新用户信息
 * @param {*} ctx 
 */
 async updateUser(ctx) {
   try {
    const values = ctx.request.body; 
    const { id } = verifyToken(ctx);
    const errInfo = verify(ctx,'updateUser',{ ...values }); 
    if (!_.isEmpty(errInfo)) {
      throw new ApiError(null,errInfo)
    }
    const res = await UserService.update(ctx,id,
      { 
        ...values,
        updatedAt: Date.now(),
      },
      {
        filters: '-password'
      });
    if(_.isEmpty(res)) {
      throw new ApiError('ACCOUNT_NOT_EXIST');
    }
    ctx.body = res;
   }catch(err) {
     throw err;
   }
 },
/**
 * 修改密码
 * @param {*} ctx 
 */
  async updatePassword (ctx) {
    try {
      const {
        password,
        newPassword,
        confirmPassword,
      } = ctx.request.body; 
      const { id } = verifyToken(ctx);
      const errInfo = verify(ctx,'updateUser',{ password: newPassword }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      if(!verifyPasswrod(newPassword)) {
        throw new ApiError(null,{
          code: 100000,
          message: '密码格式错误！',
          name: 'INVALID_PARAM',
        });
      }
      if(confirmPassword !== newPassword){
        throw new ApiError(null,{
          code: 100000,
          message: '两次输入的密码不一致！',
          name: 'INVALID_PARAM',
        });
      }
      const user = await UserService.find(ctx,{
        query: {
          _id: id,
        },
        filters: 'password',
      });
      if(user.password !== encrypt(password)) {
        throw new ApiError('BAD_CREDENTIALS');
      }
      const res = await UserService.update(ctx,id,
        { 
          password: encrypt(newPassword),
          updatedAt: Date.now(),
        },
        {
          filters: '-password'
        });

      if(_.isEmpty(res)) {
        throw new ApiError('ACCOUNT_NOT_EXIST');
      }
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

   /**
   * 上传头像
   * @param {*} ctx 
   */
  async updateAvatar (ctx) {
    try {
      const {
        imgBase,
        suffix,
      } = ctx.request.body;
      const { id } = verifyToken(ctx);
      if (imgBase && suffix) {
        const fileProps = formatBase64File(imgBase, suffix);
        const result = await qn.upFile(fileProps.filePath,fileProps.fileName);
        if (result) {
          const res = await UserService.update(ctx,id,
            { 
              avatar: result.key,
              updatedAt: Date.now(),
            },
            {
              filters: '-password'
            });
          if(_.isEmpty(res)) {
            throw new ApiError('ACCOUNT_NOT_EXIST');
          }
          ctx.body = res;
        } else {
          throw new ApiError(null,{
            code: 100000,
            message: '上传失败',
          });
        }
      } else {
        ctx.throw(400,'参数异常！');
      }
    } catch (err) {
      throw err;
    }
  }
}

