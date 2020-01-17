const { CODE_ENUM } = require('../enum');

/**
 * API错误名称
 */
var ApiErrorNames = {};

/**
 * API错误名称对应的错误信息
 */
const errorMap = new Map();
Object.keys(CODE_ENUM).forEach(key => {
  errorMap.set(key, CODE_ENUM[key]);
})

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (errorName) => {

    var errorInfo;

    if (errorName) {
        errorInfo = errorMap.get(errorName);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!errorInfo) {
        errorName = UNKNOW_ERROR;
        errorInfo = errorMap.get(errorName);
    }
    
    return errorInfo;
}

module.exports = ApiErrorNames;