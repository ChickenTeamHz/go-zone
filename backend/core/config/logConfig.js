/**
 * log4js 配置文件
 * 日志等级由低到高
 * 关于log4js的appenders的配置说明
 * https://github.com/nomiddlename/log4js-node/wiki/Appenders
 */

var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../../logs')

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error.log";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// var errorLogPath = path.resolve(__dirname, "../logs/error/error");
 

//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response.log";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
    "appenders": {
        "error":  // 错误日志
        {
            "category":"errorLogger",             //logger名称
            "type": "dateFile",                   //日志类型
            "filename": errorLogPath,             //日志输出位置
            "alwaysIncludePattern":true,          //是否总是有后缀名
            "pattern": "yyyy-MM-dd-hh",      //后缀，每小时创建一个新的日志文件
            "path": errorPath,                     //自定义属性，错误日志的根目录
            "compress": true,
            "alwaysIncludePattern": true,
            "daysToKeep": 15,
            "keepFileExt": true
        },
        "default":        //响应日志
        {
            "category":"resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern":true,
            "pattern": "yyyy-MM-dd-hh",
            "path": responsePath,
            "compress": true,
            "alwaysIncludePattern": true,
            "daysToKeep": 15,
            "keepFileExt": true 
        },
        "maxInfo": {
            "type": "logLevelFilter",
            "appender": "default",
            "level": "debug",
            "maxLevel": "info"
        },
        "minError": {
            "type": "logLevelFilter",
            "appender": "error",
            "level": "error"
        },
        "out": {
            "type": "console"
        },
    },
    "categories": {
        "default": {
          "appenders": [
            "out",
            "maxInfo",
            "minError"
          ],
          "level": "all",
          "enableCallStack": true
        }
    },
    "replaceConsole": true,
    "baseLogPath": baseLogPath                  //logs根目录
}