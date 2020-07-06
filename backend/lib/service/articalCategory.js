
'use strict';
const {
    ArticalCategoryModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
} = require('../dao/baseDao');


class ArticalCategoryService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null
    } = {}) {

        let listdata = _list(ArticalCategoryModel, payload, {
            query: query,
            searchKeys: searchKeys,
            populate: populate,
            filters
        });
        return listdata;
    }

    // 查找一条数据
    async findOne(ctx, {
        query = {},
        populate = [],
        filters = null
    } = {}) {
        return _item(ctx, ArticalCategoryModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(ArticalCategoryModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, ArticalCategoryModel, _id, payload, { options: { select: filters, new: true }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, ArticalCategoryModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, ArticalCategoryModel, values);
    }
}

module.exports = new ArticalCategoryService();