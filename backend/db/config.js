const host = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'go-zone';
const user = process.env.DB_USER || 'go';
const password = process.env.DB_PASSWORD || '123456';
const port = process.env.DB_PORT || '27017';

const DBConfig = {
  baseUrl: `mongodb://${user}:${password}@${host}:${port}/${dbName}`,
};

const jwtSecret = 'gozone'
const jwtTime = '24h';

module.exports.dbConfig = DBConfig;
module.exports.jwtSecret = jwtSecret;
module.exports.jwtTime = jwtTime;