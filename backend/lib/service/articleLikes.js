
'use strict';
const {
    ArticleLikesModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
    _count,
} = require('../dao/baseDao');


class ArticleLikesService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null,
        sort = {},
    } = {}) {

        let listdata = _list(ArticleLikesModel, payload, {
            query: query,
            searchKeys: searchKeys,
            populate: populate,
            filters,
            sort,
        });
        return listdata;
    }

    // 查找一条数据
    async findOne(ctx, {
        query = {},
        populate = [],
        filters = null
    } = {}) {
        return _item(ctx, ArticleLikesModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(ArticleLikesModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '', ...options } = {}) {
        return _update(ctx, ArticleLikesModel, _id, payload, { options: { select: filters, new: true, ...options }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, ArticleLikesModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, ArticleLikesModel, values);
    }

    // 统计个数
    async count(query = {}) {
      return _count(ArticleLikesModel, query)
    }
}

module.exports = new ArticleLikesService();