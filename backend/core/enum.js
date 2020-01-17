/*
 * @Author: Fairy
 * @Description: code码
 * @Last Modified by:  Fairy
 * @Last Modified time: 2020-01-10 17:25:06
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
  BAD_CREDENTIALS: getRes(100002, '用户名或密码错误'),
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

const PATTERN = {
  INT_DEC: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
  ALL_EN: /^[A-Za-z]+$/,
  UPPER_EN: /^[A-Z]+$/,
  LOWER_EN: /^[a-z]+$/,
  PHONE: /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/,
  INT: /^([1-9]\d*)$/,
  POS_INT: /^(0|[1-9]\d*)$/,
  FLOAT_TWO: /(^(0|[1-9]\d*)$)|(^[0-9]\d*\.{1}[0-9]{1,2}$)/,
  WHITE_SPACE: /\s/,
  CH: /^[\u4e00-\u9fa5]+$/,
  CH_EN: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
  CH_EN_NUM: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
  EN_NUM: /^[a-zA-Z0-9]+$/,
  EN_NUM_CHAR_M2:/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)/,
  EMOJI: /[\uD83C\uDF00-\uD83D\uDDFF]|[\uD83E\uDD00-\uD83E\uDDFF]|[\uD83D\uDE00-\uD83D\uDE4F]|[\uD83D\uDE80-\uD83D\uDEFF]|[\u2600-\u26FF]\uFE0F?|[\u2700-\u27BF]\uFE0F?|\u24C2\uFE0F?|[\uD83C\uDDE6-\uD83C\uDDFF]{1,2}|[\uD83C\uDD70\uD83C\uDD71\uD83C\uDD7E\uD83C\uDD7F\uD83C\uDD8E\uD83C\uDD91-\uD83C\uDD9A]\uFE0F?|[\u0023\u002A\u0030-\u0039]\uFE0F?\u20E3|[\u2194-\u2199\u21A9-\u21AA]\uFE0F?|[\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55]\uFE0F?|[\u2934\u2935]\uFE0F?|[\u3030\u303D]\uFE0F?|[\u3297\u3299]\uFE0F?|[\uD83C\uDE01\uD83C\uDE02\uD83C\uDE1A\uD83C\uDE2F\uD83C\uDE32-\uD83C\uDE3A\uD83C\uDE50\uD83C\uDE51]\uFE0F?|[\u203C\u2049]\uFE0F?|[\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE]\uFE0F?|[\u00A9\u00AE]\uFE0F?|[\u2122\u2139]\uFE0F?|\uD83C\uDC04\uFE0F?|\uD83C\uDCCF\uFE0F?|[\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA]\uFE0F?/u,
};

module.exports = { CODE_ENUM, PATTERN };
