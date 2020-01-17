const crypto = require('crypto');

exports.encrypt = function encrypt(pwd) {
  const md5 = crypto.createHash('md5');
  md5.update(pwd);
  return md5.digest('hex');
};