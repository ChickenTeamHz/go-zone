const mongoose = require('mongoose'); 
const { dbConfig } = require('./config');

/*
 * @Author: Fairy
 * @Description: 连接数据库
 * @Last Modified by:  Fairy
 * @Last Modified time: 2020-01-10 17:24:03
*/
exports.start = (success) => {   
  mongoose.connect(dbConfig.baseUrl, { useNewUrlParser: true,  useUnifiedTopology: true });   
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;   
  db.on('error', function (error) {
    console.error('connection error: ' + error);
    mongoose.disconnect();
  });
  db.on('close', function () {
      console.log('数据库断开，重新连接数据库');
  });
  db.once('open', () => {   
    console.log('连接数据库成功！');   
    if (success) {   
      success();   
    }   
  });  
};
