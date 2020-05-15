const {
  UserService
} = require('~service');

const ApiError = require('~ApiError');
const { formatBase64File, formatFile } = require('~utils/util');
const qn = require('~utils/upload');

module.exports = {
  /**
   * 上传文件
   * @param {*} ctx 
   */
  async uploadFile (ctx) {
    try {
      const { file } = ctx.request.files; // 获取上传文件
      if (file) {
        const fileProps = formatFile(file);
        // 调用方法(封装在utils文件夹内)
        const result = await qn.upFile(fileProps.filePath,fileProps.fileName)
        if (result) {
          ctx.body = {
            key: result.key,
            url: `${qn.config.origin}${result.key}`,
          };
        } else {
          throw new ApiError(null,{
            code: 100000,
            message: '上传失败',
          });
        }
      } else {
        ctx.throw(400,'没有选择任何文件！');
      }
    } catch (err) {
      throw err;
    }
  },

  /**
   * 上传base64图片
   * @param {*} ctx 
   */
  async upLoadBase64File (ctx) {
    try {
      const {
        imgBase,
        suffix,
      } = ctx.request.body;
      if (imgBase && suffix) {
        const fileProps = formatBase64File(imgBase, suffix);
        const result = await qn.upFile(fileProps.filePath,fileProps.fileName);
        if (result) {
          ctx.body = {
            key: result.key,
            url: `${qn.config.origin}${result.key}`,
          };
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
  },
}

