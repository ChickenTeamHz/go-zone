/*
 * @ Author: Fairy
 * @ Description: 相册类别表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:39:19
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
const Schema = mongoose.Schema;

const PhotoCategorySchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: String // 类别名称
});

PhotoCategorySchema.set('toJSON', { getters: true, virtuals: true });
PhotoCategorySchema.set('toObject', { getters: true, virtuals: true });


var PhotoCategory = mongoose.model("PhotoCategory", PhotoCategorySchema);

module.exports = PhotoCategory;