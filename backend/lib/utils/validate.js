/*
 * @ Author: Fairy
 * @ Description: 参数校验
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-17 18:46:05
*/

const  { PATTERN } = require('../../core/enum');


function getSomeRule(rule, params) {
  if(params && params instanceof Object) {
    const r = {};
    Object.keys(params).forEach(key => {
      r[key] = rule[key];
    });
    return r;
  }
  return rule;
}

exports.verify = (ctx,controlName, params = null) => {
  let rule = '';
  switch (controlName) {
      case 'register':
          rule = this.registerRule;
          break;
      case 'updateUser':
        rule = getSomeRule(this.registerRule, params);
        break;
      case 'album':
        rule = this.albumRule;
        break;
      case 'artical':
        rule = getSomeRule(this.articleRule, params);
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


exports.albumRule = {
  name: {
    type: 'string',
    max: [10,'相册名称不能超过10位！'],
    required: true,
    message: '相册名称不能为空',
  },
  coverPath: {
    type: 'string',
    message: '相册封面不能为空',
  },
}

exports.articleRule = {
  title: {
    type: 'string',
    max: [100,'文章标题不能超过100位！'],
    required: true,
    message: '文章标题不能为空',
  },
  coverPath: {
    type: 'string',
    require: true,
    message: '相册封面不能为空',
  },
  tags: {
    type: 'array',
    min: [1,'至少添加一个标签！'],
    max: [5,'最多添加5个标签！'],
    itemType: 'string',
    require: true,
    message: '标签不能为空',
  },
  category: {
    type: 'string',
    require: true,
    message: '分类专栏不能为空',
  },
  content: {
    type: 'string',
    require: true,
    message: '文章内容不能为空',
  },
  public: {
    type: 'boolean',
    require: true,
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
