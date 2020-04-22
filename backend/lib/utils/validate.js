/*
 * @ Author: Fairy
 * @ Description: 参数校验
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-17 18:46:05
*/

const  { PATTERN } = require('../../core/enum');

exports.verify = (ctx,controlName, params = null) => {
  let rule = '';
  switch (controlName) {
      case 'register':
          rule = this.registerRule;
          break;
      default:
          break;
  }
  return ctx.verifyParams(rule,params);
}


exports.registerRule = {
  username: {
    type: 'string',
    min: [4,'用户名不能小于4位！'],
    max: [15,'用户名不能超过15位！'],
    format: [PATTERN.EN_NUM, '用户名只支持字母或者数字！'],
    required: true,
    message: '用户名不能为空！'
  },
  nickname: {
    type: 'string',
    min: [4,'昵称不能小于4位！'],
    max: [15,'昵称不能超过15位！'],
    required: true,
    message: '昵称不能为空！'
  },
  password: {
    type: 'string',
    min: [6, '密码不能小于6位'],
    max: [20, '密码不能超过20位'],
    required: true,
    message: '密码不能为空！',
  },
}

/**
 * 校验密码
 */
exports.verifyPasswrod = (val) => {
  const whitespaceReg = /\s/;
  const stringReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)/;
  const wordReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  if(val.match(stringReg) && !val.match(whitespaceReg) && !wordReg.test(val)) {
    return true;
  }
  return false;
}