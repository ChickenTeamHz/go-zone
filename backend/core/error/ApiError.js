const ApiErrorName = require('./ApiErrorName');


/**
 * 自定义Api异常
 */
class ApiError extends Error{
    
    //构造方法
    constructor(errName = '', body = {
      code: -1,
      message: '未知错误',
      name: 'UNKNOW_ERROR'
    }){
        super();
        if(errName) {
          const errorInfo = ApiErrorName.getErrorInfo(errName);
          this.name = errName;
          this.code = errorInfo.code;
          this.message = errorInfo.message;
        }else {
          this.name = body.name;
          this.code = body.code;
          this.message = body.message;
        }
    }
}



module.exports = ApiError;