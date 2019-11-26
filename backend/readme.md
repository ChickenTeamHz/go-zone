## 基于 Koa2 + mongodb 的go-zone

> Author: Fairy & Chisfee

### 项目简介

自我学习一波node后端，为了更好的成为一个全栈工程师。所以默默做了这个项目。

### 项目结构

+ 主目录

目录 | 说明
 :-: | :-:
/routes|路由地址，输出接口地址
/index.js|主要的入口文件(引入一些第三方内容)
/package.json|项目的包管理
/lib|数据库表的操作

+ lib目录

目录 | 说明
 :-: | :-:
/controller|控制层相关文件(提供接口)
/service|操作数据库
/models|数据库模型(传统意义上的表结构) 

### 环境搭建

 + node
   + node官方下载地址: https://nodejs.org/zh-cn/download/
 + mongodb
   + mac下mongodb安装教程: https://www.jianshu.com/p/7241f7c83f4a
   + windows下mongodb安装教程: https://blog.csdn.net/zhongkaigood/article/details/81475904
   + robomongo(mongodb数据库可视化--免费): https://robomongo.org/download
 + koa-bodyparser
   + 处理post请求返回的数据
   + npm: https://www.npmjs.com/package/koa-bodyparser
 + koa2-cors
   + 处理跨域问题
   + npm: https://www.npmjs.com/package/koa2-cors
 + koa-static
   + 处理静态文件所需
   + npm: https://www.npmjs.com/package/koa-static
 + koa-router
   + 处理koa路由
   + npm: https://www.npmjs.com/package/koa-router
 + 本地安装nodemon
   + nodemon会监听你的代码，当有变动的时候自动帮你重启项目
   + npm: https://www.npmjs.com/package/nodemon
 + yarn(选装)---代替npm/cnpm
 + homebrew(选装)---包版本管理工具

### 项目运行 

+ `yarn`或者`cnpm i`或者`npm i`
+ `nodemon app`或者`node app`