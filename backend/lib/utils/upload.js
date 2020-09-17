// 引入七牛模块  
const qiniu = require("qiniu");

const qn = {};

//要上传的空间名

qn.config = {
  bucket: 'go-zone',
  accessKey :'Gq_GMW0pWIAEca9QsADchD_whjcDCIoQZtO2AIQd',
  secretKey : 'EbHPxIgBgewEVb6P5r3f9yz50ExUSaGrwDTxfV8i',
  origin: 'http://go-zone.top/'
}

// （获取七牛上传token）
qn.upToken = function() {
  const putPolicy = new qiniu.rs.PutPolicy({ scope: qn.config.bucket, expires:  3600 * 24 });
  const mac = new qiniu.auth.digest.Mac(qn.config.accessKey, qn.config.secretKey);
  const uploadToken = putPolicy.uploadToken(mac);
  return uploadToken;
}


qn.upFile = function(filePath, key) {
  const config = new qiniu.conf.Config();
  // 空间对应的机房 一定要按自己属区Zone对象
  // - 华东 qiniu.zone.Zone_z0
  // - 华北 qiniu.zone.Zone_z1
  // - 华南 qiniu.zone.Zone_z2
  // - 北美 qiniu.zone.Zone_na0
  config.zone = qiniu.zone.Zone_z2;
  const localFile = filePath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new Promise((resolved, reject) => {
    // 以文件流的形式进行上传
    // uploadToken是token， key是上传到七牛后保存的文件名, localFile是流文件
    // putExtra是上传的文件参数，采用源码中的默认参数
    formUploader.putStream(qn.upToken(), key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr)
      } else {
        resolved(respBody)
      }
    })
  })
}

module.exports = qn;