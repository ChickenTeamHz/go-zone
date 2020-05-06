const crypto = require('crypto');
const randomString = require('random-string');
const { verify } = require('jsonwebtoken');
const { jwtSecret } = require('../../db/config');

exports.encrypt = function encrypt(pwd) {
  const md5 = crypto.createHash('md5');
  md5.update(pwd);
  return md5.digest('hex');
};

exports.randomPass = function randomPass(props = {}) {
  return randomString({...props});
}

exports.verifyToken = function verifyToken(ctx) {
  const { authorization: token } = ctx.headers;
  return verify(token.split(' ')[1], jwtSecret); 
}