const crypto = require('crypto');
const fs = require('fs');
const uuid = require('uuid');
const moment = require('moment');
const Stream = require('stream');
const randomString = require('random-string');
const { verify } = require('jsonwebtoken');
const { jwtSecret } = require('../../db/config');

function encrypt(pwd) {
  const md5 = crypto.createHash('md5');
  md5.update(pwd);
  return md5.digest('hex');
};

function randomPass(props = {}) {
  return randomString({...props});
}

function verifyToken(ctx) {
  const { authorization: token } = ctx.headers;
  return verify(token.split(' ')[1], jwtSecret); 
}

// 获取文件名
function getFileName(suffix) {
  const path = moment().format('YYYY-MM-DD');
  return `${path}/${uuid.v1()}.${suffix}`;
}

// 格式化文件
function formatFile(file) {
  // 创建文件可读流
  const reader = fs.createReadStream(file.path);
  // 获取上传文件扩展名
  const ext = file.name.split(".").pop();
  const fileName = getFileName(ext);
  return {
    filePath: reader,
    fileName,
  }
}

// 格式化base64文件
function formatBase64File(imgBase,suffix){
  const b64string = imgBase.replace(/^data:image\/\w+;base64,/, "");
  const fileName = getFileName(suffix);
  const buff = Buffer.from(b64string, 'base64');
  const stream = new Stream.PassThrough();
  stream.end(buff);
  return {
    filePath: stream,
    fileName,
  }
}

module.exports = {
  encrypt,
  randomPass,
  verifyToken,
  getFileName,
  formatFile,
  formatBase64File,
}