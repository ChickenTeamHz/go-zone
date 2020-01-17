const ApiError = require('~ApiError');

var responseFormatter = () => {
  return async (ctx, next) => {
    try {
        await next();
    } catch(err) {
      if(err instanceof ApiError) {
        ctx.status = 200;
        ctx.body = {
          code: err.code,
          message: err.message,
        }
      }else {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
          message: err.message || '服务器出错，请稍后再试',
          code: err.code || ctx.status || 500,
        }
      }
      throw err;
    }
    if(ctx.body instanceof Object && !ctx.body.code && !ctx.body.message) {
      ctx.body = {
        code: 0,
        message: 'success',
        data: ctx.body || {},
      }
    }
  }
}

module.exports = responseFormatter;