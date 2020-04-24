const crypto = require('crypto');
const randomString = require('random-string');

exports.encrypt = function encrypt(pwd) {
  const md5 = crypto.createHash('md5');
  md5.update(pwd);
  return md5.digest('hex');
};

exports.randomPass = function randomPass(props = {}) {
  return randomString({...props});
}