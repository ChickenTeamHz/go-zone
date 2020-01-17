/*
 * @ Author: Fairy
 * @ Description: 文章类别表
 * @ Last Modified by:  Fairy
 * @ Last Modified time: 2020-01-13 18:47:22
*/
const mongoose = require('mongoose');
var shortid = require('shortid');
const Schema = mongoose.Schema;

const ArticalCategorySchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  title: String // 类别名称
});

ArticalCategorySchema.set('toJSON', { getters: true, virtuals: true });
ArticalCategorySchema.set('toObject', { getters: true, virtuals: true });

var ArticalCategory = mongoose.model("ArticalCategory", ArticalCategorySchema);

module.exports = ArticalCategory;