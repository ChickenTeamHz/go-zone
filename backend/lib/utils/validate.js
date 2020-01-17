/*
 * @ Author: Fairy
 * @ Description: 参数校验
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-17 18:46:05
*/
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
    min: [1,'用户名长度不能小于1位！'],
    max: [15,'用户名长度不能超过15位！'],
    required: true,
    message: '用户名不能为空！'
  },
  password: {
    type: 'string',
    min: [6, '密码不能小于6位'],
    max: [15, '密码不能超过15位'],
    required: true,
    message: '密码不能为空！',
  }
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