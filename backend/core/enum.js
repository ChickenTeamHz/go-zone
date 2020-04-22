/*
 * @Author: Fairy
 * @Description: code码
 * @Last Modified by: Fairy
 * @Last Modified time: 2020-04-22 16:35:40
*/


/**
 * 获取 response 格式
 * @param {*} code 
 * @param {*} message 
 * @param {*} data 
 */
function getRes(code = 0, message = '', data = {}){
  return {
    code,
    message,
    data,
  };
};

/**
 * code枚举
 */
const CODE_ENUM = {
  UNKNOW_ERROR: getRes(-1,'未知错误'),
  SYSTEM_BUSY: getRes(999999, '系统繁忙，请稍后再试'),
  /************************************************
  * 100000-100099 用户相关状态码
  ************************************************/
  ACCOUNT_DISABLE: getRes(100001, '账号不可用'),
  BAD_CREDENTIALS: getRes(100002, '密码错误'),
  ACCOUNT_NOT_EXIST: getRes(100003, '用户不存在'),
  ACCOUNT_FAILED_RETRY_LIMIT: getRes(100004, '用户登录失败，重试已达上限。'),
  ACCOUNT_INVALID: getRes(100005, '登录失效，请重新登陆'),
  UNAUTHORIZED_OPERATION: getRes(100006, '未授权操作'),
  /************************************************
   * 100100-100199 文件相关状态码
   ************************************************/
  FILE_NOT_FOUND: getRes(100101, '文件不存在'),
  UPLOAD_FILE_FAIL: getRes(100102, '上传文件失败'),
  FILE_TYPE_ERROR: getRes(100103, '上传文件格式不正确'),
  FILE_SIZE_ERROR: getRes(100104, '上传文件超过上限'),
}


/**
  EN: 字母,
  UPPER_EN: 大写字母,
  LOWER_EN: 小写字母,
  PHONE: 手机号,
  INT: 整数
  POS_INT: 正整数,
  NOT_NEG_INT: 非负整数,
  FLOAT_TWO: 最多两位浮点数,
  WHITE_SPACE: 空格符,
  CH: 汉字
  CH_EN: 汉字+字母,
  CH_EN_NUM: 汉字+字母+数字,
  EN_NUM: 字母+数字,
  EMAIL: 邮箱地址
  CREDIT_CODE: 统一社会信用代码,
 */
const PATTERN = {
  EN: /^[A-Za-z]+$/,
  UPPER_EN: /^[A-Z]+$/,
  LOWER_EN: /^[a-z]+$/,
  PHONE: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0135-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0135-9]\d{2}|6[2567]\d{2}|4[579]\d{2})\d{6}$/,
  INT: /^-?[1-9]\d*$/,
  POS_INT: /^([1-9]\d*)$/,
  NOT_NEG_INT: /^(0|[1-9]\d*)$/,
  FLOAT_TWO: /(^(0|[1-9]\d*)$)|(^[0-9]\d*\.{1}[0-9]{1,2}$)/,
  WHITE_SPACE: /\s/,
  CH: /^[\u4e00-\u9fa5]+$/,
  CH_EN: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
  CH_EN_NUM: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
  EN_NUM: /^[a-zA-Z0-9]+$/,
  EMAIL: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  CREDIT_CODE:/^[A-Z0-9]{18}$/,
};

module.exports = { CODE_ENUM, PATTERN };
